CREATE TABLE "AuthUser" (
  "id" integer PRIMARY KEY,
  "email" string,
  "password" string,
  "avatar_url" string
);

CREATE TABLE "Form" (
  "id" integeer PRIMARY KEY,
  "title" string,
  "description" string(optional),
  "duration" string(optional),
  "form_type" string,
  "owner_id" integer
);

CREATE TABLE "FormParticipant" (
  "id" integer PRIMARY KEY,
  "name" string,
  "email" string,
  "owner_id" integer
);

CREATE TABLE "FormItems" (
  "id" integer PRIMARY KEY,
  "date" string,
  "start_time" string,
  "end_time" string,
  "score" integer,
  "maxcap" integer,
  "title" string,
  "owner_id" integer
);

CREATE TABLE "FormParticipantChoice" (
  "id" integer PRIMARY KEY,
  "form_item_id" integer,
  "owner_id" integer
);

ALTER TABLE "Form" ADD FOREIGN KEY ("owner_id") REFERENCES "AuthUser" ("id");

ALTER TABLE "FormParticipant" ADD FOREIGN KEY ("owner_id") REFERENCES "Form" ("id");

ALTER TABLE "FormItems" ADD FOREIGN KEY ("owner_id") REFERENCES "Form" ("id");

ALTER TABLE "FormParticipantChoice" ADD FOREIGN KEY ("owner_id") REFERENCES "FormParticipant" ("id");
