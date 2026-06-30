import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { Module } from "@prisma/client";

export class ModulePermissionDto {
  @IsEnum(Module)
  module: Module;

  @IsBoolean() @IsOptional() canView?: boolean;
  @IsBoolean() @IsOptional() canCreate?: boolean;
  @IsBoolean() @IsOptional() canEdit?: boolean;
  @IsBoolean() @IsOptional() canDelete?: boolean;
}
