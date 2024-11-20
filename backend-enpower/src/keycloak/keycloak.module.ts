// src/keycloak/keycloak.module.ts

import { Module } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';

@Module({
  providers: [KeycloakService],
  exports: [KeycloakService], // Asegúrate de exportarlo
})
export class KeycloakModule {}
