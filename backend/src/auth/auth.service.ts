import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

const scrypt = promisify(scryptCallback);

type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(dto: SignupDto) {
    const email = dto.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new ConflictException("An account with this email already exists");
    }

    const passwordHash = await this.hashPassword(dto.password);
    const user = await this.prisma.user.create({
      data: { name: dto.name.trim(), email, passwordHash },
    });

    return { user: this.toPublicUser(user) };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user?.passwordHash || !(await this.verifyPassword(dto.password, user.passwordHash))) {
      throw new UnauthorizedException("Email or password is incorrect");
    }

    return { user: this.toPublicUser(user) };
  }

  async changePassword(userId: string | undefined, dto: ChangePasswordDto) {
    if (!userId) throw new UnauthorizedException("You must be signed in to change your password");
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.passwordHash || !(await this.verifyPassword(dto.currentPassword, user.passwordHash))) {
      throw new UnauthorizedException("Current password is incorrect");
    }
    if (dto.currentPassword === dto.newPassword) {
      throw new ConflictException("New password must be different from the current password");
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: await this.hashPassword(dto.newPassword) },
    });
    return { message: "Password updated successfully" };
  }

  async resetPassword(userId: string, newPassword: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: await this.hashPassword(newPassword) },
    });
    return { message: "Password reset successfully" };
  }

  private async hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString("hex")}`;
  }

  private async verifyPassword(password: string, storedHash: string) {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;

    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    const storedKey = Buffer.from(key, "hex");
    return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey);
  }

  private toPublicUser(user: { id: string; name: string; email: string; role: string }): PublicUser {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}
