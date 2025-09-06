export const databaseConfig = {
  type: 'postgres' as const,
  url: process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/catalog',
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
};
