import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from "class-validator";
import { Plan, SchoolStatus } from "@prisma/client";

export class CreateSchoolDto {
  @ApiProperty({ example: "Springfield High School" })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({
    example: "springfield",
    description: "Subdomain slug (lowercase letters, numbers, hyphens).",
  })
  @IsString()
  @Matches(/^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/, {
    message: "slug must be lowercase alphanumeric/hyphen, 2-40 chars",
  })
  slug!: string;

  @ApiPropertyOptional({ example: "office@springfield.edu" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "+91 80000 00000" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: "12 School Road, City" })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ enum: Plan, default: Plan.FREE })
  @IsOptional()
  @IsEnum(Plan)
  plan?: Plan;

  @ApiPropertyOptional({ enum: SchoolStatus, default: SchoolStatus.TRIAL })
  @IsOptional()
  @IsEnum(SchoolStatus)
  status?: SchoolStatus;
}
