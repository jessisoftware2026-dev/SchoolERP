import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

const SAFE_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  schoolId: true,
  createdAt: true,
  updatedAt: true,
};

// Tenant-scoped: a school ADMIN only manages users within their own school.
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string) {
    return this.prisma.user.findMany({
      where: { schoolId },
      select: SAFE_SELECT,
      orderBy: { createdAt: "asc" },
    });
  }

  async findOne(schoolId: string, id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, schoolId },
      select: SAFE_SELECT,
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async create(schoolId: string, dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({
      where: { schoolId_email: { schoolId, email: dto.email } },
    });
    if (exists) throw new ConflictException("Email already in use");

    const passwordHash = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        role: dto.role ?? "STAFF",
        passwordHash,
        schoolId,
      },
      select: SAFE_SELECT,
    });
  }

  async update(schoolId: string, id: string, dto: UpdateUserDto) {
    await this.findOne(schoolId, id);
    const data: Record<string, unknown> = {};
    if (dto.name) data.name = dto.name;
    if (dto.role) data.role = dto.role;
    if (dto.password) data.passwordHash = await bcrypt.hash(dto.password, 10);

    if (Object.keys(data).length === 0) {
      throw new BadRequestException("No fields to update");
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: SAFE_SELECT,
    });
  }

  async remove(schoolId: string, id: string, requesterId: string) {
    if (id === requesterId) {
      throw new ForbiddenException("You cannot delete your own account");
    }
    await this.findOne(schoolId, id);
    await this.prisma.user.delete({ where: { id } });
    return { deleted: true, id };
  }
}
