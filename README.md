# Study-App-MVP

## Dependencies

### Server (Express + Supabase)
- express
- cors
- dotenv
- @supabase/supabase-js

Install with:
```bash
cd Server
npm install
```

### Client (Next.js + Bootstrap + Supabase)
- next
- react
- react-dom
- bootstrap
- @supabase/supabase-js

Install with:
```bash
cd Client
npm install
```

### Concurrency
use this so you dont have start the Server and Client in 2 different terminals
```bash
cd root
npm install --save-dev concurrently
```

## .env and api
- The project requires 2 seperate enviroment files
- Make a .env.local in the client
```bash
cd Client
touch .env.local
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
```
- Make a .env in the Server
```bash
cd Server
touch .env
SUPABASE_URL=""
SUPABASE_SERVICE_ROLE_KEY=""
```
- Reach out to me for the keys and URL

### Running the app
- run:
```bash
npm run dev
```
- The server will be hosted on local host 5001, while the client is hosted on local host 3000 (for now)
- vist http://localhost:3000

