import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import {
  Model,
  Types,
} from 'mongoose';

import {
  SosEvent,
  SosEventDocument,
  SosEventStatus,
  SosTriggeredByRole,
} from './schemas/sos-event.schema';

import {
  AuthUser,
} from '../auth/decorators/current-user.decorator';

import {
  UserRole,
} from '../users/user.schema';

import {
  FamilyAccess,
  FamilyAccessDocument,
  FamilyAccessStatus,
  FamilyPermission,
} from '../family/schemas/family-access.schema';

import {
  Relationship,
  RelationshipDocument,
  RelationshipStatus,
} from '../relationships/schemas/relationship.schema';

import {
  CreateSosDto,
} from './dto/create-sos.dto';

import {
  ResolveSosDto,
} from './dto/resolve-sos.dto';

import {
  AuditService,
} from '../common/audit/audit.service';

@Injectable()
export class SosService {
  constructor(
    @InjectModel(SosEvent.name)
    private readonly sosEvents: Model<SosEventDocument>,

    @InjectModel(FamilyAccess.name)
    private readonly familyAccess: Model<FamilyAccessDocument>,

    @InjectModel(Relationship.name)
    private readonly relationships: Model<RelationshipDocument>,

    private readonly audit: AuditService,
  ) {}

  async createSos(
    user: AuthUser,
    seniorId: string,
    dto: CreateSosDto,
    requestId: string,
  ) {
    const seniorObjectId =
      this.toObjectId(
        seniorId,
        'Invalid senior ID',
      );

    await this.assertCanTriggerSos(
      user,
      seniorObjectId,
    );

    const event =
      await this.sosEvents.create({
        seniorId:
          seniorObjectId,

        triggeredById:
          new Types.ObjectId(user.id),

        triggeredByRole:
          this.toTriggeredByRole(
            user.role,
          ),

        type:
          dto.type,

        message:
          dto.message?.trim() ?? '',

        latitude:
          dto.latitude,

        longitude:
          dto.longitude,

        locationLabel:
          dto.locationLabel?.trim(),

        status:
          SosEventStatus.TRIGGERED,
      });

    await this.audit.record({
      action:
        'safety.sos.created',

      requestId,

      actorId:
        user.id,

      actorRole:
        user.role,

      resourceType:
        'sos_event',

      resourceId:
        String(event._id),
    });

    return this.toResponse(event);
  }

  async getSosForSenior(
    user: AuthUser,
    seniorId: string,
  ) {
    const seniorObjectId =
      this.toObjectId(
        seniorId,
        'Invalid senior ID',
      );

    await this.assertCanViewSos(
      user,
      seniorObjectId,
    );

    const events =
      await this.sosEvents
        .find({
          seniorId:
            seniorObjectId,
        })
        .sort({
          createdAt: -1,
        });

    return {
      events:
        events.map(
          (event) =>
            this.toResponse(
              event,
            ),
        ),
    };
  }

  async getActiveSos(
    user: AuthUser,
    seniorId: string,
  ) {
    const seniorObjectId =
      this.toObjectId(
        seniorId,
        'Invalid senior ID',
      );

    await this.assertCanViewSos(
      user,
      seniorObjectId,
    );

    const events =
      await this.sosEvents
        .find({
          seniorId:
            seniorObjectId,

          status: {
            $in: [
              SosEventStatus.TRIGGERED,
              SosEventStatus.ACKNOWLEDGED,
            ],
          },
        })
        .sort({
          createdAt: -1,
        });

    return {
      events:
        events.map(
          (event) =>
            this.toResponse(
              event,
            ),
        ),
    };
  }

  async acknowledgeSos(
    user: AuthUser,
    sosId: string,
    requestId: string,
  ) {
    const event =
      await this.findSos(
        sosId,
      );

    await this.assertCanManageSos(
      user,
      event.seniorId,
    );

    if (
      event.status !==
      SosEventStatus.TRIGGERED
    ) {
      throw new BadRequestException(
        'Only triggered SOS events can be acknowledged',
      );
    }

    event.status =
      SosEventStatus.ACKNOWLEDGED;

    event.acknowledgedAt =
      new Date();

    event.acknowledgedById =
      new Types.ObjectId(
        user.id,
      );

    await event.save();

    await this.audit.record({
      action:
        'safety.sos.acknowledged',

      requestId,

      actorId:
        user.id,

      actorRole:
        user.role,

      resourceType:
        'sos_event',

      resourceId:
        String(event._id),
    });

    return this.toResponse(event);
  }

  async resolveSos(
    user: AuthUser,
    sosId: string,
    dto: ResolveSosDto,
    requestId: string,
  ) {
    const event =
      await this.findSos(
        sosId,
      );

    await this.assertCanManageSos(
      user,
      event.seniorId,
    );

    if (
      event.status !==
        SosEventStatus.TRIGGERED &&
      event.status !==
        SosEventStatus.ACKNOWLEDGED
    ) {
      throw new BadRequestException(
        'Only active SOS events can be resolved',
      );
    }

    event.status =
      SosEventStatus.RESOLVED;

    event.resolvedAt =
      new Date();

    event.resolvedById =
      new Types.ObjectId(
        user.id,
      );

    event.resolutionNote =
      dto.resolutionNote?.trim();

    await event.save();

    await this.audit.record({
      action:
        'safety.sos.resolved',

      requestId,

      actorId:
        user.id,

      actorRole:
        user.role,

      resourceType:
        'sos_event',

      resourceId:
        String(event._id),
    });

    return this.toResponse(event);
  }

  private async assertCanTriggerSos(
    user: AuthUser,
    seniorId: Types.ObjectId,
  ) {
    const userObjectId =
      new Types.ObjectId(
        user.id,
      );

    // Senior can trigger SOS for themselves.
    if (
      user.role ===
        UserRole.SENIOR &&
      userObjectId.equals(
        seniorId,
      )
    ) {
      return;
    }

    // Admin can trigger SOS for any senior.
    if (
      user.role ===
      UserRole.ADMIN
    ) {
      return;
    }

    // Family can trigger SOS only for an
    // authorized senior with safety permission.
    if (
      user.role ===
      UserRole.FAMILY
    ) {
      const access =
        await this.familyAccess.findOne(
          {
            seniorId,
            familyUserId:
              userObjectId,

            status:
              FamilyAccessStatus.ACTIVE,

            permissions: {
              $in: [
                FamilyPermission.SAFETY_ALERTS,
              ],
            },
          },
        );

      if (!access) {
        throw new ForbiddenException(
          'You are not authorized to trigger safety alerts for this senior',
        );
      }

      return;
    }

    // Companion can trigger SOS only when
    // an established relationship exists.
    if (
      user.role ===
      UserRole.COMPANION
    ) {
      const relationship =
        await this.relationships.findOne(
          {
            seniorId,

            companionId:
              userObjectId,

            status:
              RelationshipStatus.ESTABLISHED,
          },
        );

      if (!relationship) {
        throw new ForbiddenException(
          'You do not have an established relationship with this senior',
        );
      }

      return;
    }

    throw new ForbiddenException(
      'You are not authorized to trigger an SOS',
    );
  }

  private async assertCanViewSos(
    user: AuthUser,
    seniorId: Types.ObjectId,
  ) {
    const userObjectId =
      new Types.ObjectId(
        user.id,
      );

    // Senior can view their own safety events.
    if (
      user.role ===
        UserRole.SENIOR &&
      userObjectId.equals(
        seniorId,
      )
    ) {
      return;
    }

    // Admin can view any SOS.
    if (
      user.role ===
      UserRole.ADMIN
    ) {
      return;
    }

    // Family needs safety_alerts permission.
    if (
      user.role ===
      UserRole.FAMILY
    ) {
      const access =
        await this.familyAccess.findOne(
          {
            seniorId,

            familyUserId:
              userObjectId,

            status:
              FamilyAccessStatus.ACTIVE,

            permissions: {
              $in: [
                FamilyPermission.SAFETY_ALERTS,
              ],
            },
          },
        );

      if (!access) {
        throw new ForbiddenException(
          'You are not authorized to view safety alerts for this senior',
        );
      }

      return;
    }

    // Established companion can view
    // safety events for their senior.
    if (
      user.role ===
      UserRole.COMPANION
    ) {
      const relationship =
        await this.relationships.findOne(
          {
            seniorId,

            companionId:
              userObjectId,

            status:
              RelationshipStatus.ESTABLISHED,
          },
        );

      if (!relationship) {
        throw new ForbiddenException(
          'You do not have an established relationship with this senior',
        );
      }

      return;
    }

    throw new ForbiddenException(
      'You are not authorized to view this senior safety information',
    );
  }

  private async assertCanManageSos(
    user: AuthUser,
    seniorId: Types.ObjectId,
  ) {
    const userObjectId =
      new Types.ObjectId(
        user.id,
      );

    // Admin can always manage SOS.
    if (
      user.role ===
      UserRole.ADMIN
    ) {
      return;
    }

    // Senior can manage their own SOS.
    if (
      user.role ===
        UserRole.SENIOR &&
      userObjectId.equals(
        seniorId,
      )
    ) {
      return;
    }

    // Family needs safety_alerts permission.
    if (
      user.role ===
      UserRole.FAMILY
    ) {
      const access =
        await this.familyAccess.findOne(
          {
            seniorId,

            familyUserId:
              userObjectId,

            status:
              FamilyAccessStatus.ACTIVE,

            permissions: {
              $in: [
                FamilyPermission.SAFETY_ALERTS,
              ],
            },
          },
        );

      if (!access) {
        throw new ForbiddenException(
          'You are not authorized to manage safety alerts for this senior',
        );
      }

      return;
    }

    // Established companion can acknowledge
    // or resolve SOS for their senior.
    if (
      user.role ===
      UserRole.COMPANION
    ) {
      const relationship =
        await this.relationships.findOne(
          {
            seniorId,

            companionId:
              userObjectId,

            status:
              RelationshipStatus.ESTABLISHED,
          },
        );

      if (!relationship) {
        throw new ForbiddenException(
          'You do not have an established relationship with this senior',
        );
      }

      return;
    }

    throw new ForbiddenException(
      'You are not authorized to manage this SOS',
    );
  }

  private async findSos(
    sosId: string,
  ) {
    const objectId =
      this.toObjectId(
        sosId,
        'Invalid SOS ID',
      );

    const event =
      await this.sosEvents.findById(
        objectId,
      );

    if (!event) {
      throw new NotFoundException(
        'SOS event not found',
      );
    }

    return event;
  }

  private toTriggeredByRole(
    role: UserRole,
  ): SosTriggeredByRole {
    switch (role) {
      case UserRole.SENIOR:
        return SosTriggeredByRole.SENIOR;

      case UserRole.FAMILY:
        return SosTriggeredByRole.FAMILY;

      case UserRole.COMPANION:
        return SosTriggeredByRole.COMPANION;

      case UserRole.ADMIN:
        return SosTriggeredByRole.ADMIN;

      default:
        throw new ForbiddenException(
          'Unsupported user role for SOS',
        );
    }
  }

  private toResponse(
    event: SosEventDocument,
  ) {
    return {
      sos: {
        id:
          String(event._id),

        seniorId:
          String(event.seniorId),

        triggeredById:
          String(
            event.triggeredById,
          ),

        triggeredByRole:
          event.triggeredByRole,

        type:
          event.type,

        message:
          event.message,

        latitude:
          event.latitude,

        longitude:
          event.longitude,

        locationLabel:
          event.locationLabel,

        status:
          event.status,

        acknowledgedAt:
          event.acknowledgedAt,

        acknowledgedById:
          event.acknowledgedById
            ? String(
                event.acknowledgedById,
              )
            : undefined,

        resolvedAt:
          event.resolvedAt,

        resolvedById:
          event.resolvedById
            ? String(
                event.resolvedById,
              )
            : undefined,

        resolutionNote:
          event.resolutionNote,
      },
    };
  }

  private toObjectId(
    value: string,
    message: string,
  ) {
    if (
      !Types.ObjectId.isValid(
        value,
      )
    ) {
      throw new BadRequestException(
        message,
      );
    }

    return new Types.ObjectId(
      value,
    );
  }
}