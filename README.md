**Start project**

1. _Clone project:_ 
    `https://github.com/designrad/Moth-backend.git`
 
2. _Install requirement:_
    `mpm install` or `npm i`

3. _Create user admin:_
    in `/app.js`

    ```model.Admin.findOne().then(r => {
        if(!r) {
            let admin = new model.Admin({
                username: "admin", <== login
                email: 'admin@email.com',
                password: 'admin123' <== password
            });
            admin.save();
            console.info('[HC] New admin with credentials ${admin.username}, ${admin.email} created!');
        }
    });```
 
4. _run project:_
    `nodemon app.js` <=== debug
    `node app.js` <=== deploy

5. install constants for views:
    file `/core/constants/index.js`

`http://localhost:3001`