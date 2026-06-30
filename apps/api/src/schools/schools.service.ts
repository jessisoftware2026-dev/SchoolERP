import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSchoolDto } from "./dto/create-school.dto";
import { UpdateSchoolDto } from "./dto/update-school.dto";

@Injectable()
export class SchoolsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const schools = await this.prisma.school.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { users: true, students: true } } },
    });
    return schools.map((s) => ({
      ...s,
      userCount: s._count.users,
      studentCount: s._count.students,
    }));
  }

  async findOne(id: string) {
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) throw new NotFoundException(`School ${id} not found`);
    return school;
  }

  async create(dto: CreateSchoolDto) {
    try {
      return await this.prisma.school.create({ data: dto });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        throw new ConflictException(`Slug "${dto.slug}" is already taken`);
      }
      throw e;
    }
  }

  async update(id: string, dto: UpdateSchoolDto) {
    await this.findOne(id);
    try {
      return await this.prisma.school.update({ where: { id }, data: dto });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        throw new ConflictException(`Slug "${dto.slug}" is already taken`);
      }
      throw e;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.school.delete({ where: { id } }); // cascades users + students
    return { deleted: true, id };
  }
}
