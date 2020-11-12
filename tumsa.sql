--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2 (Debian 12.2-2.pgdg100+1)
-- Dumped by pg_dump version 12.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--




CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: controlpoints; Type: TABLE; Schema: public; Owner: postgres
--
/*
CREATE TABLE public.controlpoints (
    id integer NOT NULL,
    name character varying,
    blocked numeric,
    created timestamp without time zone
);


ALTER TABLE public.controlpoints OWNER TO postgres;

--
-- Name: controlpoints_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.controlpoints_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.controlpoints_id_seq OWNER TO postgres;

--
-- Name: controlpoints_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.controlpoints_id_seq OWNED BY public.controlpoints.id;
*/

CREATE TABLE public.roles (
    nid character varying NOT NULL,
    hour character varying,
    rounds numeric,
    route character varying
);

ALTER TABLE public.roles ADD COLUMN start_point character varying;
ALTER TABLE public.roles ADD COLUMN end_point character varying;
ALTER TABLE public.roles ADD COLUMN comments text;
ALTER TABLE public.roles ADD COLUMN delay numeric default 1;
ALTER TABLE public.roles ADD COLUMN priority numeric default 0;
ALTER TABLE public.roles OWNER TO postgres;



CREATE TABLE public.routes (
    nid character varying NOT NULL,
    name character varying,
    time_rounds numeric,
    created_by character varying,
    created timestamp without time zone,
    status numeric,
    points json
);

ALTER TABLE public.routes OWNER TO postgres;


CREATE TABLE public.departures (
    nid character varying NOT NULL,
    trip json,
    route json,
    rounds numeric,
    total_time numeric,
    vehicle json,
    created timestamp without time zone,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    start_point character varying,
    end_point character varying
);

ALTER TABLE public.departures ADD COLUMN comments text;
ALTER TABLE public.departures ADD COLUMN delay numeric default 1;
ALTER TABLE public.departures OWNER TO postgres;
ALTER TABLE public.departures ADD COLUMN priority numeric default 0;


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

/*CREATE TABLE public.profiles (
    nid character varying NOT NULL,
    name character varying,
    access json
);


ALTER TABLE public.profiles OWNER TO postgres;
*/
--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--
/*
CREATE TABLE public.users (
    nid character varying NOT NULL,
    username character varying,
    password character varying,
    surname character varying,
    firstName character varying,
    emailAddress character varying,
    created timestamp without time zone,
    updated timestamp without time zone,
    lastlogin timestamp without time zone,
    profile character varying,
    blocked numeric DEFAULT 0
);


ALTER TABLE public.users OWNER TO postgres;
*/
--
-- Name: controlpoints id; Type: DEFAULT; Schema: public; Owner: postgres
--

--ALTER TABLE ONLY public.controlpoints ALTER COLUMN id SET DEFAULT nextval('public.controlpoints_id_seq'::regclass);


--
-- Data for Name: controlpoints; Type: TABLE DATA; Schema: public; Owner: postgres
--

--COPY public.controlpoints (id, name, blocked, created) FROM stdin;
--\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Name: controlpoints_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

--SELECT pg_catalog.setval('public.controlpoints_id_seq', 1, false);


--
-- Name: controlpoints controlpoints_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

--ALTER TABLE ONLY public.controlpoints
 --   ADD CONSTRAINT controlpoints_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

--ALTER TABLE ONLY public.profiles
  --  ADD CONSTRAINT profiles_pkey PRIMARY KEY (nid);



ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_pkey PRIMARY KEY (nid);



ALTER TABLE ONLY public.departures
    ADD CONSTRAINT depertures_pkey PRIMARY KEY (nid);


ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (nid);

--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

--ALTER TABLE ONLY public.users
  --  ADD CONSTRAINT users_pkey PRIMARY KEY (nid);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

--ALTER TABLE ONLY public.users
  --  ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: users users_profile_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

--ALTER TABLE ONLY public.users
  --  ADD CONSTRAINT users_profile_fkey FOREIGN KEY (profile) REFERENCES public.profiles(nid);


--
-- PostgreSQL database dump complete
--

