# Migrate from old project

path: archive folder

1. Analyze the old project and understand the structure and the code
2. 2 key frontend and backend.
3. Frontend: what should wee copy? but better and logical way. NOT copy the full file.
   - styles
   - components (not all just smart way and care about the logic)
   - pages
   - utils
   - hooks
   - types
   - services
   - store
   - config
   - i18n

4. Backend: what should wee copy? but better and logical way. NOT copy the full file.
	- auth
	- user
	- gatteway
	- comment
	- post
	- post
	- profile
	- settings


# Rule of the migration
first need a plan how can wee the old files and code use.
Server side components is important for loading the data from the server.

Create just one by one the parts, example:
frontend components: logical names and structure small clean components with shadcn/ui and tailwindcss.
3 Big part on frontend, Root page, dashboard page, and the data 