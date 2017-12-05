Execute these commands in (the Windows equivalent of) a terminal window to run test.js:  
`cd mongoProject`  
`mongo jmpat < test.js`

If you want to test in the database, first follow the steps to setup the database. Then, in the mongoProject folder:
`mongo`  
`use jmpat`  
`db.users.find(...)`
