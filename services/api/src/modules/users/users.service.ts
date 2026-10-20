import { Injectable } from "@nestjs/common";

import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) {}

  async getById(id: string) {
    return this.usersRepository.findById(id);
  }

  async getByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async createAccount(input: {
    email: string;
    passwordHash: string;
    displayName: string;
    timezone: string;
  }) {
    return this.usersRepository.createAccount(
      input,
    );
  }
}