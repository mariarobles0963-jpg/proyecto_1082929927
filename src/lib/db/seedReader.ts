import { readJson } from "@/lib/db/reader";
import type { SeedData } from "@/lib/db/seedReader.types";

/**
 * Devuelve el objeto completo del seed.json
 */
export function getSeed(): SeedData {
  return readJson<SeedData>("seed");
}

export function getUsers() {
  const s = getSeed();
  return s.users;
}

export function getSystemConfig() {
  const s = getSeed();
  return s.system_config;
}

export function getProducts() {
  const s = getSeed();
  return s.products;
}
