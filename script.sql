create type "Provider" as enum ('KAKAO', 'FACEBOOK');

alter type "Provider" owner to "haseon-ung";

create type "Gender" as enum ('FEMALE', 'MALE');

alter type "Gender" owner to "haseon-ung";

-- Unknown how to generate base type type

comment on type cube is 'multi-dimensional cube ''(FLOAT-1, FLOAT-2, ..., FLOAT-N), (FLOAT-1, FLOAT-2, ..., FLOAT-N)''';

alter type cube owner to "haseon-ung";

create domain earth as cube
    constraint not_3d check (cube_dim(VALUE) <= 3) constraint not_point check cube_is_point(VALUE) constraint on_surface check (abs(
                                                                                                                                        ((cube_distance(VALUE, '(0)'::cube) / earth()) -
                                                                                                                                         (1)::double precision)) <
                                                                                                                                '1e-06'::double precision);

alter domain earth owner to "haseon-ung";

create table if not exists "_Migration"
(
    revision           serial       not null
        constraint "_Migration_pkey"
            primary key,
    name               text         not null,
    datamodel          text         not null,
    status             text         not null,
    applied            integer      not null,
    rolled_back        integer      not null,
    datamodel_steps    text         not null,
    database_migration text         not null,
    errors             text         not null,
    started_at         timestamp(3) not null,
    finished_at        timestamp(3)
);

alter table "_Migration"
    owner to "haseon-ung";

create table if not exists "Event"
(
    "createdAt" timestamp(3) default CURRENT_TIMESTAMP not null,
    "expireAt"  timestamp(3)                           not null,
    id          serial                                 not null
        constraint "Event_pkey"
            primary key,
    "startAt"   timestamp(3)                           not null,
    thumbnail   text                                   not null,
    url         text                                   not null
);

alter table "Event"
    owner to "haseon-ung";

create unique index if not exists "Event.url"
    on "Event" (url);

create table if not exists "Rest"
(
    address        text,
    "desc"         text   not null,
    id             serial not null
        constraint "Rest_pkey"
            primary key,
    name           text   not null,
    "openingHours" text,
    phone          text   not null,
    thumbnail      text   not null
);

alter table "Rest"
    owner to "haseon-ung";

create table if not exists "File"
(
    id       serial  not null
        constraint "File_pkey"
            primary key,
    "restId" integer not null
        constraint "File_restId_fkey"
            references "Rest"
            on update cascade on delete cascade,
    url      text    not null
);

alter table "File"
    owner to "haseon-ung";

create table if not exists "Location"
(
    latitude  numeric(65, 30) not null,
    longitude numeric(65, 30) not null,
    "restId"  integer         not null
        constraint "Location_restId_fkey"
            references "Rest"
            on update cascade on delete cascade
);

alter table "Location"
    owner to "haseon-ung";

create unique index if not exists "Location.restId"
    on "Location" ("restId");

create table if not exists "Service"
(
    "desc"      text                not null,
    "restId"    integer             not null
        constraint "Service_restId_fkey"
            references "Rest"
            on update cascade on delete cascade,
    service     text                not null,
    "validTime" integer default 168 not null,
    warn        text
);

alter table "Service"
    owner to "haseon-ung";

create unique index if not exists "Service.restId"
    on "Service" ("restId");

create table if not exists "User"
(
    "createdAt" timestamp(3) default CURRENT_TIMESTAMP not null,
    id          text                                   not null
        constraint "User_pkey"
            primary key,
    nickname    text                                   not null,
    phone       text                                   not null
);

alter table "User"
    owner to "haseon-ung";

create table if not exists "AccountLink"
(
    id       text       not null,
    provider "Provider" not null,
    token    text       not null,
    "userId" text       not null
        constraint "AccountLink_userId_fkey"
            references "User"
            on update cascade on delete cascade,
    constraint "AccountLink_pkey"
        primary key (provider, id)
);

alter table "AccountLink"
    owner to "haseon-ung";

create unique index if not exists "AccountLink.userId"
    on "AccountLink" ("userId");

create table if not exists "Coupon"
(
    "createdAt" timestamp(3) default CURRENT_TIMESTAMP not null,
    "desc"      text                                   not null,
    "expireAt"  timestamp(3)                           not null,
    id          serial                                 not null
        constraint "Coupon_pkey"
            primary key,
    "restId"    integer                                not null
        constraint "Coupon_restId_fkey"
            references "Rest"
            on update cascade on delete cascade,
    service     text                                   not null,
    "userId"    text                                   not null
        constraint "Coupon_userId_fkey"
            references "User"
            on update cascade on delete cascade,
    warn        text                                   not null
);

alter table "Coupon"
    owner to "haseon-ung";

create table if not exists "Like"
(
    id       serial  not null
        constraint "Like_pkey"
            primary key,
    "restId" integer not null
        constraint "Like_restId_fkey"
            references "Rest"
            on update cascade on delete cascade,
    "userId" text    not null
        constraint "Like_userId_fkey"
            references "User"
            on update cascade on delete cascade
);

alter table "Like"
    owner to "haseon-ung";

create unique index if not exists "Like.restId_userId"
    on "Like" ("restId", "userId");

create table if not exists "Profile"
(
    birthday timestamp(3),
    email    text,
    gender   "Gender",
    id       serial not null
        constraint "Profile_pkey"
            primary key,
    name     text,
    "userId" text   not null
        constraint "Profile_userId_fkey"
            references "User"
            on update cascade on delete cascade
);

alter table "Profile"
    owner to "haseon-ung";

create unique index if not exists "Profile.email"
    on "Profile" (email);

create unique index if not exists "Profile.userId"
    on "Profile" ("userId");

create unique index if not exists "User.nickname"
    on "User" (nickname);

create unique index if not exists "User.phone"
    on "User" (phone);

create table if not exists "Authentication"
(
    code        text                                   not null,
    "createdAt" timestamp(3) default CURRENT_TIMESTAMP not null,
    "expireAt"  timestamp(3)                           not null,
    id          text                                   not null,
    "limit"     integer      default 5                 not null,
    phone       text                                   not null,
    provider    "Provider"                             not null,
    constraint "Authentication_pkey"
        primary key (provider, id)
);

alter table "Authentication"
    owner to "haseon-ung";

create table if not exists "Notice"
(
    body        text                                   not null,
    "createdAt" timestamp(3) default CURRENT_TIMESTAMP not null,
    id          serial                                 not null
        constraint "Notice_pkey"
            primary key,
    tag         text,
    title       text                                   not null
);

alter table "Notice"
    owner to "haseon-ung";

create table if not exists spatial_ref_sys
(
    auth_name text,
    auth_srid integer,
    proj4text text,
    srid      integer not null
        constraint spatial_ref_sys_pkey
            primary key,
    srtext    text
);

alter table spatial_ref_sys
    owner to "haseon-ung";

create function cube_in(cstring) returns cube
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube_in(cstring) owner to "haseon-ung";

create function cube(double precision[], double precision[]) returns cube
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube(double precision[], double precision[]) owner to "haseon-ung";

create function cube(double precision[]) returns cube
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube(double precision[]) owner to "haseon-ung";

create function cube_out(cube) returns cstring
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube_out(cube) owner to "haseon-ung";

create function cube_eq(cube, cube) returns boolean
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

comment on function cube_eq(cube, cube) is 'same as';

alter function cube_eq(cube, cube) owner to "haseon-ung";

create function cube_ne(cube, cube) returns boolean
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

comment on function cube_ne(cube, cube) is 'different';

alter function cube_ne(cube, cube) owner to "haseon-ung";

create function cube_lt(cube, cube) returns boolean
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

comment on function cube_lt(cube, cube) is 'lower than';

alter function cube_lt(cube, cube) owner to "haseon-ung";

create function cube_gt(cube, cube) returns boolean
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

comment on function cube_gt(cube, cube) is 'greater than';

alter function cube_gt(cube, cube) owner to "haseon-ung";

create function cube_le(cube, cube) returns boolean
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

comment on function cube_le(cube, cube) is 'lower than or equal to';

alter function cube_le(cube, cube) owner to "haseon-ung";

create function cube_ge(cube, cube) returns boolean
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

comment on function cube_ge(cube, cube) is 'greater than or equal to';

alter function cube_ge(cube, cube) owner to "haseon-ung";

create function cube_cmp(cube, cube) returns integer
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

comment on function cube_cmp(cube, cube) is 'btree comparison function';

alter function cube_cmp(cube, cube) owner to "haseon-ung";

create function cube_contains(cube, cube) returns boolean
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

comment on function cube_contains(cube, cube) is 'contains';

alter function cube_contains(cube, cube) owner to "haseon-ung";

create function cube_contained(cube, cube) returns boolean
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

comment on function cube_contained(cube, cube) is 'contained in';

alter function cube_contained(cube, cube) owner to "haseon-ung";

create function cube_overlap(cube, cube) returns boolean
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

comment on function cube_overlap(cube, cube) is 'overlaps';

alter function cube_overlap(cube, cube) owner to "haseon-ung";

create function cube_union(cube, cube) returns cube
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube_union(cube, cube) owner to "haseon-ung";

create function cube_inter(cube, cube) returns cube
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube_inter(cube, cube) owner to "haseon-ung";

create function cube_size(cube) returns double precision
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube_size(cube) owner to "haseon-ung";

create function cube_subset(cube, integer[]) returns cube
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube_subset(cube, integer[]) owner to "haseon-ung";

create function cube_distance(cube, cube) returns double precision
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube_distance(cube, cube) owner to "haseon-ung";

create function distance_chebyshev(cube, cube) returns double precision
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function distance_chebyshev(cube, cube) owner to "haseon-ung";

create function distance_taxicab(cube, cube) returns double precision
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function distance_taxicab(cube, cube) owner to "haseon-ung";

create function cube_dim(cube) returns integer
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube_dim(cube) owner to "haseon-ung";

create function cube_ll_coord(cube, integer) returns double precision
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube_ll_coord(cube, integer) owner to "haseon-ung";

create function cube_ur_coord(cube, integer) returns double precision
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube_ur_coord(cube, integer) owner to "haseon-ung";

create function cube_coord(cube, integer) returns double precision
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube_coord(cube, integer) owner to "haseon-ung";

create function cube_coord_llur(cube, integer) returns double precision
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube_coord_llur(cube, integer) owner to "haseon-ung";

create function cube(double precision) returns cube
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube(double precision) owner to "haseon-ung";

create function cube(double precision, double precision) returns cube
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube(double precision, double precision) owner to "haseon-ung";

create function cube(cube, double precision) returns cube
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube(cube, double precision) owner to "haseon-ung";

create function cube(cube, double precision, double precision) returns cube
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube(cube, double precision, double precision) owner to "haseon-ung";

create function cube_is_point(cube) returns boolean
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube_is_point(cube) owner to "haseon-ung";

create function cube_enlarge(cube, double precision, integer) returns cube
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function cube_enlarge(cube, double precision, integer) owner to "haseon-ung";

create function g_cube_consistent(internal, cube, smallint, oid, internal) returns boolean
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function g_cube_consistent(internal, cube, smallint, oid, internal) owner to "haseon-ung";

create function g_cube_penalty(internal, internal, internal) returns internal
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function g_cube_penalty(internal, internal, internal) owner to "haseon-ung";

create function g_cube_picksplit(internal, internal) returns internal
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function g_cube_picksplit(internal, internal) owner to "haseon-ung";

create function g_cube_union(internal, internal) returns cube
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function g_cube_union(internal, internal) owner to "haseon-ung";

create function g_cube_same(cube, cube, internal) returns internal
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function g_cube_same(cube, cube, internal) owner to "haseon-ung";

create function g_cube_distance(internal, cube, smallint, oid, internal) returns double precision
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function g_cube_distance(internal, cube, smallint, oid, internal) owner to "haseon-ung";

create function earth() returns double precision
    immutable
    parallel safe
    language sql
as
$$
SELECT '6378168'::float8
$$;

alter function earth() owner to "haseon-ung";

create function sec_to_gc(double precision) returns double precision
    immutable
    strict
    parallel safe
    language sql
as
$$
SELECT CASE
           WHEN $1 < 0 THEN 0::float8
           WHEN $1 / (2 * earth()) > 1 THEN pi() * earth()
           ELSE 2 * earth() * asin($1 / (2 * earth())) END
$$;

alter function sec_to_gc(double precision) owner to "haseon-ung";

create function gc_to_sec(double precision) returns double precision
    immutable
    strict
    parallel safe
    language sql
as
$$
SELECT CASE
           WHEN $1 < 0 THEN 0::float8
           WHEN $1 / earth() > pi() THEN 2 * earth()
           ELSE 2 * earth() * sin($1 / (2 * earth())) END
$$;

alter function gc_to_sec(double precision) owner to "haseon-ung";

create function ll_to_earth(double precision, double precision) returns earth
    immutable
    strict
    parallel safe
    language sql
as
$$
SELECT cube(cube(cube(earth() * cos(radians($1)) * cos(radians($2))), earth() * cos(radians($1)) * sin(radians($2))),
            earth() * sin(radians($1)))::earth
$$;

alter function ll_to_earth(double precision, double precision) owner to "haseon-ung";

create function latitude(earth) returns double precision
    immutable
    strict
    parallel safe
    language sql
as
$$
SELECT CASE
           WHEN cube_ll_coord($1, 3) / earth() < -1 THEN -90::float8
           WHEN cube_ll_coord($1, 3) / earth() > 1 THEN 90::float8
           ELSE degrees(asin(cube_ll_coord($1, 3) / earth())) END
$$;

alter function latitude(earth) owner to "haseon-ung";

create function longitude(earth) returns double precision
    immutable
    strict
    parallel safe
    language sql
as
$$
SELECT degrees(atan2(cube_ll_coord($1, 2), cube_ll_coord($1, 1)))
$$;

alter function longitude(earth) owner to "haseon-ung";

create function earth_distance(earth, earth) returns double precision
    immutable
    strict
    parallel safe
    language sql
as
$$
SELECT sec_to_gc(cube_distance($1, $2))
$$;

alter function earth_distance(earth, earth) owner to "haseon-ung";

create function earth_box(earth, double precision) returns cube
    immutable
    strict
    parallel safe
    language sql
as
$$
SELECT cube_enlarge($1, gc_to_sec($2), 3)
$$;

alter function earth_box(earth, double precision) owner to "haseon-ung";

create function geo_distance(point, point) returns double precision
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function geo_distance(point, point) owner to "haseon-ung";

create operator > (procedure = cube_gt, leftarg = cube, rightarg = cube);

alter operator >(cube, cube) owner to "haseon-ung";

create operator >= (procedure = cube_ge, leftarg = cube, rightarg = cube);

alter operator >=(cube, cube) owner to "haseon-ung";

create operator < (procedure = cube_lt, leftarg = cube, rightarg = cube);

alter operator <(cube, cube) owner to "haseon-ung";

create operator <= (procedure = cube_le, leftarg = cube, rightarg = cube);

alter operator <=(cube, cube) owner to "haseon-ung";

create operator && (procedure = cube_overlap, leftarg = cube, rightarg = cube);

alter operator &&(cube, cube) owner to "haseon-ung";

create operator <> (procedure = cube_ne, leftarg = cube, rightarg = cube);

alter operator <>(cube, cube) owner to "haseon-ung";

create operator = (procedure = cube_eq, leftarg = cube, rightarg = cube);

alter operator =(cube, cube) owner to "haseon-ung";

create operator <@ (procedure = cube_contained, leftarg = cube, rightarg = cube);

alter operator <@(cube, cube) owner to "haseon-ung";

create operator @> (procedure = cube_contains, leftarg = cube, rightarg = cube);

alter operator @>(cube, cube) owner to "haseon-ung";

create operator -> (procedure = cube_coord, leftarg = cube, rightarg = integer);

alter operator ->(cube, integer) owner to "haseon-ung";

create operator ~> (procedure = cube_coord_llur, leftarg = cube, rightarg = integer);

alter operator ~>(cube, integer) owner to "haseon-ung";

create operator <#> (procedure = distance_taxicab, leftarg = cube, rightarg = cube);

alter operator <#>(cube, cube) owner to "haseon-ung";

create operator <-> (procedure = cube_distance, leftarg = cube, rightarg = cube);

alter operator <->(cube, cube) owner to "haseon-ung";

create operator <=> (procedure = distance_chebyshev, leftarg = cube, rightarg = cube);

alter operator <=>(cube, cube) owner to "haseon-ung";

create operator ~ (procedure = cube_contained, leftarg = cube, rightarg = cube);

alter operator ~(cube, cube) owner to "haseon-ung";

create operator @ (procedure = cube_contains, leftarg = cube, rightarg = cube);

alter operator @(cube, cube) owner to "haseon-ung";

create operator <@> (procedure = geo_distance, leftarg = point, rightarg = point);

alter operator <@>(point, point) owner to "haseon-ung";


