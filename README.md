**Start project**

1. _Clone project:_ 
    `git clone https://github.com/designrad/Moth-backend.git`
 
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
 
4. _run project debug:_
    `nodemon app.js`
    
5. _run project deploy:_
    `npm i -g forever`
    `forever -a --uid backend start app.js`

5. install constants for views:
    file `/core/constants/index.js`

`http://localhost:3001`

**Maintenance**

1. _Startup backend:_
    `forever -a --uid backend start /home/malerjakt/Moth-backend/app.js`

2. _Install SSL with cron automatic updates:_
    There are two cron's implemented:
    1. To Auto Start the app when reboot is done:
	`/etc/startapp.sh || exit 1` is added to file /etc/rc.local which runs everytime the os starts. The/etc/startapp.sh contains the command to start the app "forever -a --uid backend start /home/malerjakt/Moth-backend/app.js"
    
    2. To renew SSL:
    `15 3 * * * /usr/bin/certbot renew --quiet` is inserted in cron which opens when we enter the command "sudo crontab -e"
	 This command renews the certificate every day at 3:15 am.

3. _SSL implementation:_
    The details on implementation is explained here: https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-14-04
    
4. _SSL Certificates:_
    - Cert File: /etc/letsencrypt/live/malerjakt-admin.no/fullchain.pem;
	- Key File: /etc/letsencrypt/live/malerjakt-admin.no/privkey.pem;

	But we won't need to worry about the files, everything is managed by letsencrypt certbot.

1. _Change password/username/email:_
    - Create ssh connection to the database and update login/pass/email manually. To create new hash for the password, go here and select "10" as "number of rounds": https://www.dailycred.com/article/bcrypt-calculator
    - Update string in database, and run
    `sudo service mongodb restart`

**Updating**

1. _Make changes to code locally or in github, then:_
    `git commit -m 'WRITE HERE YOUR COMMIT MESSAGE'`
    
2. _Upload your changes to github:_
    `git push -u origin master`

3. _Re-install the changes locally, run this in Moth-backend/:_
    `npm install`
    
4. _Restart the server and you are done!:_
    `sudo reboot`
    
