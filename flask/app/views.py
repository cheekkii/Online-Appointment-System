import json
import secrets
import string
from flask import (jsonify, render_template,
                   request, url_for, flash, redirect)

from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.urls import url_parse

from sqlalchemy.sql import text
from flask_login import login_user, login_required, logout_user, current_user

from app import app, db, mail
from app import login_manager
from app import oauth
from app.models.authuser import AuthUser, PrivateForm
from app.models.form import PrivateFormItem, PrivateFormParticipant
from app.models.formparticipant import PrivateFormParticipantChoice

from flask_mail import Mail, Message
from datetime import datetime

@login_manager.user_loader
def load_user(user_id):
    # since the user_id is just the primary key of our
    # user table, use it in the query for the user
    return AuthUser.query.get(int(user_id))

@app.route('/')
def first():
    return "Gamsasi says 'Hello world!'"

@app.route('/db')
def db_connection():
    try:
        with db.engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return '<h1>db works.</h1>'
    except Exception as e:
        return '<h1>db is broken.</h1>' + str(e)


@app.route('/hashing/<title>')
def hashing(title):
    hashed_title=generate_password_hash(title, method='sha256')
    return jsonify({"hashed_title":hashed_title})


@app.route('/send-mail', methods=['POST'])
def send_mail():
    result = request.form.to_dict() 

    msg = Message(
        #subject="Hello from Flask-Mail",
        #recipients=['gamsasivimon@gmail.com'],  # Change this to the recipient's email
        #body="This is a test email sent from Flask!"

        subject=result['title'],
        sender=app.config['MAIL_DEFAULT_SENDER'],
        recipients=[result['email']],  # Change this to the recipient's email
        body=result['message']
    )
    mail.send(msg)
    return "Email sent!"    


# allow non user to fetch information, but not modify
@app.route('/dodle/get-all-form-participants/<id>', methods=['GET'])
def get_all_form_participants(id):
    db_form_participant = PrivateFormParticipant.query.filter(PrivateFormParticipant.owner_id == id)
    all_form_participants = list(map(lambda x: x.to_dict(), db_form_participant))
    return jsonify(all_form_participants)

@app.route('/dodle/get-all-form-participant-choices/<id>', methods=['GET'])
def get_all_form_participant_choices(id):
    db_form_participant_choice = PrivateFormParticipantChoice.query.filter(PrivateFormParticipantChoice.owner_id == id)
    all_this_participant_choices = list(map(lambda x: x.to_dict(), db_form_participant_choice))
    return jsonify(all_this_participant_choices)

@app.route('/dodle/get-all-form-items/<id>', methods=['GET'])
def get_all_form_items(id):
    db_form_item = PrivateFormItem.query.filter(PrivateFormItem.owner_id == id)
    all_form_items = list(map(lambda x: x.to_dict(), db_form_item))
    # formatting datetime to the one I prefer
    for item in all_form_items:
        date = item['date']
        start_time = item['start_time']
        end_time = item['end_time']

        # Convert date to 'May 2 Thu' like format
        date_obj = datetime.strptime(date, "%Y-%m-%d")
        formatted_date = date_obj.strftime("%b %d %a")


        # Convert time to 12-hour AM/PM format
        start_time_obj = datetime.strptime(start_time, "%H:%M")
        formatted_start_time = start_time_obj.strftime("%-I:%M %p")

        end_time_obj = datetime.strptime(end_time, "%H:%M")
        formatted_end_time = end_time_obj.strftime("%-I:%M %p")

        item['date'] = formatted_date
        item['start_time'] = formatted_start_time
        item['end_time'] = formatted_end_time
    return jsonify(all_form_items)

@app.route('/dodle/<id>/<hashed_title>', methods=['GET']) 
def create_and_share_page(id, hashed_title):

    db_form_item = PrivateFormItem.query.filter(PrivateFormItem.owner_id == id)
    all_form_items = list(map(lambda x: x.to_dict(), db_form_item))
    
    # formatting datetime to the one I prefer
    for item in all_form_items:
        date = item['date']
        start_time = item['start_time']
        end_time = item['end_time']

        # Convert date to 'May 2 Thu' like format
        date_obj = datetime.strptime(date, "%Y-%m-%d")
        formatted_date = date_obj.strftime("%b %d %a")


        # Convert time to 12-hour AM/PM format
        start_time_obj = datetime.strptime(start_time, "%H:%M")
        formatted_start_time = start_time_obj.strftime("%-I:%M %p")

        end_time_obj = datetime.strptime(end_time, "%H:%M")
        formatted_end_time = end_time_obj.strftime("%-I:%M %p")

        item['date'] = formatted_date
        item['start_time'] = formatted_start_time
        item['end_time'] = formatted_end_time

    
    # the sha256 generate_password_hash funtion adds a salt by default WOOWOOW
    # salting ensures that even if two users have the same password, their hashes will be different, increasing security
    # varify the hash
    if check_password_hash(hashed_title, all_form_items[0]['title']):
        
        # query getting the form via id then pass it as the first element of res
        #db_form = PrivateForm.query.filter(PrivateForm.id == id)
        db_form = PrivateForm.query.filter(PrivateForm.id == id)
        form_info = list(map(lambda x: x.to_dict(), db_form))


        form_owner = AuthUser.query.filter(AuthUser.id == form_info[0]['owner_id'])
        form_owner = list(map(lambda x: x.to_dict(), form_owner))
        del form_owner[0]['password']
        del form_owner[0]['id']
        
        print('all_form_item', all_form_items)
        print('form_info', form_info)
        print('form_owner', form_owner)
        
        return render_template('/dodle/create_share.html', form_items=all_form_items, form_info=form_info, form_owner=form_owner)
        #return jsonify({"id":id, "hashed_title":hashed_title})
    return "Access Denied"


@app.route('/dodle')
def index():
    return "Dodle index page(starting for new cummer)"

@app.route('/dodle/home')
@login_required
def home():
    db_form = PrivateForm.query.filter(PrivateForm.owner_id == current_user.id)
    all_forms = list(map(lambda x: x.to_dict(), db_form))
    

    for form in all_forms:
        db_form_item = PrivateFormItem.query.filter(PrivateFormItem.owner_id == form['id']).first()
        db_form_item = db_form_item.to_dict()
        #form['link'] = '/dodle/' + str(form['id']) + '/' + str(generate_password_hash(db_form_item['title'], method='sha256'))
        form['link'] = '/dodle/result-form/'+str(form['id']) + '/' + '@dodle@' + str(form['id']) + '@' + str(generate_password_hash(db_form_item['title'], method='sha256'))
    
    print(all_forms)
    return render_template('/dodle/home.html', all_forms=all_forms)

@app.route('/dodle/group-poll')
@login_required
def group_poll():
    return render_template('/dodle/group-poll.html')

@app.route('/dodle/sign-up-sheet')
@login_required
def sign_up_sheet():
    return render_template('/dodle/sign-up-sheet.html')

@app.route('/dodle/one-on-one')
@login_required
def one_on_one():
    return render_template('/dodle/one-on-one.html')

@app.route('/dodle/booking-page')
@login_required
def booking_page():
    return render_template('/dodle/booking-page.html')

@app.route('/dodle/event-schedule')
@login_required
def event_schedule():
    return render_template('/dodle/event.html')

@app.route('/dodle/profile')
@login_required
def profile():
    # Fetch logged-in user's details
    user = AuthUser.query.get(current_user.id)
    
    # List of available avatars
    avatar_paths = [
        "/static/img/avatar1.png",
        "/static/img/avatar2.png",
        "/static/img/avatar3.png",
        "/static/img/avatar4.png",
        "/static/img/avatar5.png",
        "/static/img/avatar6.png",
        "/static/img/avatar7.png",
        "/static/img/avatar8.png",
        "/static/img/avatar9.png",
        "/static/img/avatar10.png"
    ]
    
    # Set selected avatar (fallback to default)
    selected_avatar = user.avatar_url if user.avatar_url else "/static/img/avatar1.png"
    
    return render_template('/dodle/profile.html', user=user, avatar_paths=avatar_paths, selected_avatar=selected_avatar)

@app.route('/dodle/update_profile', methods=['POST'])
@login_required
def update_profile():
    try:
        data = request.get_json(force=True)  # Force JSON parsing
        print(f"Received payload: {data}")  # Debug log
    except Exception as e:
        print(f"Failed to parse JSON payload: {str(e)}")
        return jsonify({"success": False, "message": "Invalid JSON payload"}), 400

    if not data:
        print("No data received or invalid JSON")
        return jsonify({"success": False, "message": "No data received or invalid JSON"}), 400

    user = AuthUser.query.get(current_user.id)
    if not user:
        print("User not found")
        return jsonify({"success": False, "message": "User not found"}), 404

    try:
        user.name = data.get("name", user.name)
        user.avatar_url = data.get("avatar_url", user.avatar_url)
        db.session.commit()
        print(f"Updated user: {user}")  # Debug log
        return jsonify({"success": True})
    except Exception as e:
        db.session.rollback()
        print(f"Error updating user: {str(e)}")  # Debug log
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/dodle/thankyou')
def thankyou():
    return render_template('dodle/thankyou.html')

@app.route('/dodle/editprofile')
@login_required
def editprofile():
    user = AuthUser.query.get(current_user.id)
    return render_template('/dodle/editprofile.html', user=user)    

@app.route('/dodle/newprofile')
@login_required
def newprofile():
    user = AuthUser.query.get(current_user.id)
    return render_template('/dodle/newprofile.html', user=user)    

@app.route('/dodle/create_and_share')
@login_required
def createshare():
    return render_template('/dodle/create_share.html')


@app.route('/dodle/result-form/<form_id>/<ugly_link>')
@login_required
def result_form(form_id, ugly_link):
    ugly_link = ugly_link.replace('@', '/')
    db_form = PrivateForm.query.filter(PrivateForm.id == form_id)
    this_form = list(map(lambda x: x.to_dict(), db_form))
    print('thissssssssssssssssssssssss', this_form)
    return render_template('dodle/result_form.html', form_id=form_id, next_page=ugly_link, info_form=this_form)



# send vote(check secret token -----------------ADD FORM Password)
@app.route('/dodle/send-vote/<id>', methods=['POST'])
def send_vote(id):
    result = request.form.to_dict()
    # check if new or current participant
    
    # only allow user who know the link of secret form to vote(try to mitigate the risk of random bs attack)
    current_form_title = PrivateForm.query.get(result['form_info_id']).to_dict()['title']
    if not check_password_hash(result['form_voting_password'], current_form_title):
        return "you don't have permission to vote."

    OK = 1 # use as flag

    # bad check
    #participant = PrivateFormParticipant.query.filter(PrivateFormParticipant.email == result["email"])
    #participant = PrivateFormParticipant.query.filter(PrivateFormParticipant.owner_id == id)
    participant = PrivateFormParticipant.query.filter(PrivateFormParticipant.owner_id == id, PrivateFormParticipant.email == result['email'])
    participant_dict_list = list(map(lambda x: x.to_dict(), participant))

    screen_off = ['name', 'email', 'form_info_id', 'form_voting_password', 'csrf_token']

    if not participant_dict_list: # new participant !!! ADD NEW RECORD
        new_form_participant_dict = dict()
        new_form_participant_dict['name'] = result['name']
        new_form_participant_dict['email'] = result['email']
        new_form_participant_dict['owner_id'] = result['form_info_id']
        new_form_participant_entry = PrivateFormParticipant(**new_form_participant_dict)
        db.session.add(new_form_participant_entry)
        db.session.commit() # commit session to update new_form_participant id ( id point to db object by reference)

        # ADD VOTE RECORDS HERE
        for key in result:
            if key in screen_off:
                continue

            choice = dict()
            choice['form_item_id'] = result[key]
            choice['owner_id'] = new_form_participant_entry.id

            new_choice_entry = PrivateFormParticipantChoice(**choice)
            db.session.add(new_choice_entry)
            db.session.commit()

            # BEFORE ADD plus score of FormItem with id == form_item_id of new_choice_entry
            form_item_id = new_choice_entry.form_item_id 

            form_item = PrivateFormItem.query.get(form_item_id)
            form_item_dict = form_item.to_dict()
            del form_item_dict['owner_id']
            del form_item_dict['id']
            if form_item_dict['score'] == form_item_dict['maxcap']:
                OK = 0
            form_item_dict['score'] = min(form_item_dict['maxcap'], form_item_dict['score'] + 1)
            form_item.update(**form_item_dict)
            db.session.commit()

        
    else: # old one don't add anything just UPDATE
        # use id in participant list map it to choice owner_id then delete all
        id_ = participant_dict_list[0]['id']
        entry_to_delete = PrivateFormParticipantChoice.query.filter(PrivateFormParticipantChoice.owner_id == id_)
        #entry_to_delete.delete(synchronize_session=False)  # Deletes all matching rows
        #db.session.commit()
        entries = entry_to_delete.all()  # Fetch all matching records
        for entry in entries:
            # BEFORE DELETE minus score of FormItem with id == form_item_id or entry
            form_item_id = entry.form_item_id 
            
            form_item = PrivateFormItem.query.get(form_item_id)
            form_item_dict = form_item.to_dict()
            del form_item_dict['owner_id']
            del form_item_dict['id']
            form_item_dict['score'] = max(0, form_item_dict['score'] - 1)
            #updated_form_item_dict
            form_item.update(**form_item_dict)
            db.session.commit()

            db.session.delete(entry)  # Delete each entry individually

        db.session.commit()  # Commit changes

        # DELETE ALL PREVIOUS VOTE RECORD, THEN ADD NEW VOTE RECORD 
        for key in result:
            if key in screen_off:
                continue

            choice = dict()
            choice['form_item_id'] = result[key]
            choice['owner_id'] = id_

            new_choice_entry = PrivateFormParticipantChoice(**choice)
            db.session.add(new_choice_entry)
            db.session.commit()

            # BEFORE ADD plus score of FormItem with id == form_item_id of new_choice_entry
            form_item_id = new_choice_entry.form_item_id 

            form_item = PrivateFormItem.query.get(form_item_id)
            form_item_dict = form_item.to_dict()
            del form_item_dict['owner_id']
            del form_item_dict['id']
            if form_item_dict['score'] == form_item_dict['maxcap']:
                OK = 0
            form_item_dict['score'] = min(form_item_dict['maxcap'], form_item_dict['score'] + 1)
            form_item.update(**form_item_dict)
            db.session.commit()
    if(OK):
        return "success"
    else:
        return "not-success"


# get form list
@app.route('/dodle/form-list')
@login_required
def form_list():
    db_forms = PrivateForm.query.filter(PrivateForm.owner_id == current_user.id)
    forms = list(map(lambda x: x.to_dict(), db_forms))
    return jsonify(forms)



# create new form, or update(maybe I will do update part if I feel like it)
@app.route('/dodle/create-form', methods=['POST'])
@login_required
def create_form():
    result = request.form.to_dict()
    date_values = request.form.getlist('date[]')
    start_time_values = request.form.getlist('start_time[]')
    end_time_values = request.form.getlist('end_time[]')

    # for sign-up-sheet
    seats_values = request.form.getlist('seats[]')

    id_ = result.get('id', '')
    print('iddddddddddddddddd', id_)
    validated = True
    validated_dict = dict()
    valid_keys = ['description', 'duration', 'location', 'title', 'form_type']
    
    # validate the input
    for key in result:
        # screen of unrelated inputs
        if key not in valid_keys:
            continue

        if key == 'date[]' or key == 'start_time[]' or key == 'end_time[]':
            continue
        else:
            value = result[key].strip()
        if (not value or value == 'undefined') and not(key == 'description' or key == 'location'):
            validated = False
            break
        validated_dict[key] = value


    print('dataaaaaaaaaaaaaaaaaaaa', validated_dict)
    if validated:
        if not id_: # create new item
            validated_dict['owner_id'] = current_user.id
            form = PrivateForm(**validated_dict)
            db.session.add(form)
            db.session.commit() # commit session to update form id (form id point to db object by reference)
            validated_dict['id'] = form.id
    
            # add item to table
            for i in range(len(date_values)):
                formItem_dict = dict()
                formItem_dict['date'] = date_values[i]
                formItem_dict['start_time'] =  start_time_values[i]
                formItem_dict['end_time'] =  end_time_values[i]
                formItem_dict['score'] = 0
                formItem_dict['owner_id'] = form.id

                formItem_dict['title'] = validated_dict['title']
                if validated_dict['form_type'] == 'group-poll':
                    formItem_dict['maxcap'] = 1000000007 # use 1e9+7 as infinity
                elif validated_dict['form_type'] == 'sign-up-sheet':
                    formItem_dict['maxcap'] = seats_values[i]
                elif validated_dict['form_type'] == 'one-on-one':
                    formItem_dict['maxcap'] = 1
                else:
                    formItem_dict['maxcap'] = 1 
                
                slot = PrivateFormItem(**formItem_dict)
                db.session.add(slot)
                db.session.commit()

        else: # update current form
            # edit or add more formItem
            # query all current form item
            db_form_item = PrivateFormItem.query.filter(PrivateFormItem.owner_id == id_)
            all_form_items = list(map(lambda x: x.to_dict(), db_form_item))
            current_form = PrivateForm.query.get(id_)
            
            if current_form.owner_id == current_user.id:
                current_form.update(**validated_dict)
            db.session.commit()
            
            # check all newly add form item
            pseudo_title = all_form_items[0]['title']
            for i in range(len(date_values)):
                formItem_dict = dict()
                formItem_dict['date'] = date_values[i]
                formItem_dict['start_time'] =  start_time_values[i]
                formItem_dict['end_time'] =  end_time_values[i]
                formItem_dict['score'] = 0
                formItem_dict['owner_id'] = int(id_)
                formItem_dict['title'] = pseudo_title
                
                if validated_dict['form_type'] == 'group-poll':
                    formItem_dict['maxcap'] = 1000000007 # use 1e9+7 as infinity
                elif validated_dict['form_type'] == 'sign-up-sheet':
                    formItem_dict['maxcap'] = seats_values[i]
                elif validated_dict['form_type'] == 'one-on-one':
                    formItem_dict['maxcap'] = 1
                else:
                    formItem_dict['maxcap'] = 1 
                
                check_only = ['date', 'start_time', 'end_time'] # check for  repetition
                has = 0
                for form_item in all_form_items:
                    match = 1
                    for key in form_item:
                        if key in check_only and form_item[key] != formItem_dict[key]:
                            match = 0
                    if match == 1:
                        has = 1

                if has == 0:
                    # add new form item
                    slot = PrivateFormItem(**formItem_dict)
                    db.session.add(slot)
                    db.session.commit()
                
        
        # return current form as json as response
        return jsonify(validated_dict)



# delete old form
@app.route('/dodle/remove-form', methods=['POST'])
@login_required
def remove_form():
    result = request.form.to_dict()
    id_ = result.get('form_id', '')
    try:
        form = PrivateForm.query.get(id_)
        if form.to_dict()['owner_id'] != current_user.id:
            raise PermissionError("You do not have permission to access this form.")

        # delete all form items & form participants of this form
        db_form_participants = PrivateFormParticipant.query.filter(PrivateFormParticipant.owner_id == form.id)
        db_form_items = PrivateFormItem.query.filter(PrivateFormItem.owner_id == form.id)

        for participant in db_form_participants:
            db_choices = PrivateFormParticipantChoice.query.filter(PrivateFormParticipantChoice.owner_id == participant.id)
            db_choices.delete(synchronize_session=False)
            db.session.delete(participant) 

        db_form_items.delete(synchronize_session=False)
        db.session.commit()

        # then delete this form
        db.session.delete(form)
        db.session.commit()

        return "deleted"
    except Exception as ex:
        return ex


@app.route('/login', methods=('GET', 'POST'))
def login_page():
    if request.method == 'POST':
        # login code goes here
        email = request.form.get('email')
        password = request.form.get('password')
        remember = bool(request.form.get('remember'))

        # print("data", request.form.to_dict())
        user = AuthUser.query.filter_by(email=email).first()

        # check if the user actually exists
        # take the user-supplied password, hash it, and compare it to the
        # hashed password in the database
        if not user or not check_password_hash(user.password, password):
            flash('Please check your login details and try again.')
            # if the user doesn't exist or password is wrong, reload the page
            return redirect(url_for('login_page'))

        # if the above check passes, then we know the user has the right
        # credentials
        login_user(user, remember=remember)
        
        print(f"User logged in: {current_user.is_authenticated}")  # ตรวจสอบว่าผู้ใช้ล็อกอินสำเร็จ
        
        next_page = request.args.get('next')
        print(f"Next page: {next_page}")  # ตรวจสอบค่า next_page

        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('home')

        print(f"Redirecting to: {next_page}")  # ดูว่าได้ URL ที่ถูกต้องหรือไม่
        return redirect("/dodle/home")
    return render_template('authuser/login.html')


@app.route('/signin', methods=('GET', 'POST'))
def signin_page():
    if request.method == 'POST':
        result = request.form.to_dict()
        app.logger.debug(str(result))
 
        validated = True
        validated_dict = {}
        valid_keys = ['email', 'username', 'password','confirm_password']

        # validate the input
        for key in result:
            app.logger.debug(str(key)+": " + str(result[key]))
            # screen of unrelated inputs
            if key not in valid_keys:
                continue

            value = result[key].strip()
            if not value or value == 'undefined':
                validated = False
                break
            validated_dict[key] = value
            # code to validate and add user to database goes here
        app.logger.debug("validation done")
        # print("data : ", validated_dict)
        if validated:
            app.logger.debug('validated dict: ' + str(validated_dict))
            email = validated_dict['email']
            name = validated_dict['username']
            password = validated_dict['password']

            # check duplicate email(if email already exist)
            dup_email = AuthUser.query.filter(AuthUser.email == email).first()
            if dup_email :
                print("DUP EMAIL :", dup_email.to_dict())
                return "email has already been used"
            
            confirm_password = validated_dict['confirm_password']
            # Check if passwords match
            if password != confirm_password:
                print("Yai Yai")
                flash('Passwords do not match')
                return redirect(url_for('signin_page'))
            # if this returns a user, then the email already exists in database
            user = AuthUser.query.filter_by(email=email).first()
            print("User exists:", bool(user))
            if user:
                print("เข้าในนี้")
                # if a user is found, we want to redirect back to signup
                # page so user can try again
                flash('Email address already exists')
                return redirect(url_for('signin_page'))

            # create a new user with the form data. Hash the password so
            # the plaintext version isn't saved.
            app.logger.debug("preparing to add")
            avatar_url = gen_avatar_url(email, name)
            new_user = AuthUser(email=email, name=name,
                                password=generate_password_hash(
                                    password, method='sha256'),
                                avatar_url=avatar_url)
            # add the new user to the database
            db.session.add(new_user)
            db.session.commit()
            
            #automatically login
            login_user(new_user)

        print("Redirecting to create_profile...")
        return redirect("/dodle/profile")
    return render_template('authuser/signin.html')



@app.route('/logout')
@login_required
def logout():
    print(f"Before logout: {current_user.is_authenticated}")  # ควรเป็น True
    logout_user()
    print(f"After logout: {current_user.is_authenticated}")   # ควรเป็น False
    return redirect(url_for('first_page'))

@app.route('/google')
def google():


    oauth.register(
        name='google',
        client_id=app.config['GOOGLE_CLIENT_ID'],
        client_secret=app.config['GOOGLE_CLIENT_SECRET'],
        server_metadata_url=app.config['GOOGLE_DISCOVERY_URL'],
        client_kwargs={
            'scope': 'openid email profile'
        }
    )


   # Redirect to google_auth function
    redirect_uri = url_for('google_auth', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)




@app.route('/google/auth')
def google_auth():
    try:
        token = oauth.google.authorize_access_token()
        app.logger.debug(str(token))
    except Exception as ex:
        app.logger.error(f"Error getting token: {ex}")
        return redirect(url_for('login_page'))


    app.logger.debug(str(token))


    userinfo = token['userinfo']
    app.logger.debug(" Google User " + str(userinfo))
    email = userinfo['email']
    try:
        with db.session.begin():
            user = (AuthUser.query.filter_by(email=email).with_for_update().first())


            if not user:
                name = userinfo['given_name'] + " " + userinfo['family_name']
                random_pass_len = 8
                password = ''.join(secrets.choice(string.ascii_uppercase + string.digits)
                                for i in range(random_pass_len))
                picture = userinfo['picture']
                new_user = AuthUser(email=email, name=name,
                                    password=generate_password_hash(
                                        password, method='sha256'),
                                   avatar_url=picture)
                db.session.add(new_user)
                db.session.commit()
    except Exception as ex:
        db.session.rollback()  # Rollback on failure
        app.logger.error(f"ERROR adding new user with email {email}: {ex}")
        return redirect(url_for('login_page'))
  
    user = AuthUser.query.filter_by(email=email).first()
    login_user(user)
    return redirect('/dodle/home')



@app.route('/github')
def github():
    oauth.register(
        name='github',
        client_id=app.config['GITHUB_CLIENT_ID'],
        client_secret=app.config['GITHUB_CLIENT_SECRET'],
        authorize_url=app.config['GITHUB_AUTHORIZE_URL'],
        authorize_params=None,
        access_token_url=app.config['GITHUB_ACCESS_TOKEN_URL'],
        access_token_params=None,
        client_kwargs={'scope': 'user:email'},
    )
    redirect_uri = url_for('github_auth', _external=True)
    return oauth.github.authorize_redirect(redirect_uri)



@app.route('/github/auth')
def github_auth():
    try:
        token = oauth.github.authorize_access_token()
        app.logger.debug(str(token))
    except Exception as ex:
        app.logger.error(f"Error getting token: {ex}")
        return redirect(url_for('login_page'))

    app.logger.debug(str(token))
    
    userinfo = oauth.github.get('https://api.github.com/user').json()
    app.logger.debug("GitHub User " + str(userinfo))
    email = userinfo.get('email')
    
    if not email:
        emails = oauth.github.get('https://api.github.com/user/emails').json()
        email = next((e['email'] for e in emails if e['primary'] and e['verified']), None)
    
    if not email:
        app.logger.error("GitHub email not found or not verified.")
        return redirect(url_for('login_page'))
    
    try:
        with db.session.begin():
            user = AuthUser.query.filter_by(email=email).with_for_update().first()
            
            if not user:
                name = userinfo.get('name', userinfo.get('login'))
                random_pass_len = 8
                password = ''.join(secrets.choice(string.ascii_uppercase + string.digits)
                                   for _ in range(random_pass_len))
                picture = userinfo.get('avatar_url')
                new_user = AuthUser(email=email, name=name,
                                    password=generate_password_hash(
                                        password, method='sha256'),
                                    avatar_url=picture)
                db.session.add(new_user)
                db.session.commit()
    except Exception as ex:
        db.session.rollback()  # Rollback on failure
        app.logger.error(f"ERROR adding new user with email {email}: {ex}")
        return redirect(url_for('login_page'))
  
    user = AuthUser.query.filter_by(email=email).first()
    login_user(user)
    return redirect('/dodle/home')

    
@app.route('/first_page')
def first_page():
    return render_template('authuser/first.html')


def gen_avatar_url(email, name):
    bgcolor = generate_password_hash(email, method='sha256')[-6:]
    color = hex(int('0xffffff', 0) -
                int('0x'+bgcolor, 0)).replace('0x', '')
    lname = ''
    temp = name.split()
    fname = temp[0][0]
    if len(temp) > 1:
        lname = temp[1][0]


    avatar_url = "https://ui-avatars.com/api/?name=" + \
        fname + "+" + lname + "&background=" + \
        bgcolor + "&color=" + color
    return avatar_url


@login_manager.user_loader
def load_user(user_id):
    # since the user_id is just the primary key of our
    # user table, use it in the query for the user
    return AuthUser.query.get(int(user_id))

