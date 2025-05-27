import { execSync } from 'child_process';

const name = process.argv[2];

if (!name) {
  console.error(
    '❌ Укажи имя миграции. Пример: npm run migration:gen CreateUserTable',
  );
  process.exit(1);
}

const path = `src/infrastructure/database/migrations/${name}`;

execSync(
  `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate -d ./data-source.ts ${path}`,
  { stdio: 'inherit' },
);
