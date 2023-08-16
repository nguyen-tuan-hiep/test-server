--
-- avnadminQL database dump
--

-- Dumped from database version 15.0
-- Dumped by pg_dump version 15.0

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
-- Name: compute_final_price(); Type: FUNCTION; Schema: public; Owner: avnadmin
--

CREATE FUNCTION public.compute_final_price() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.final_price = NEW.total_price * (1 + 0.02);
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.compute_final_price() OWNER TO avnadmin;

--
-- Name: delete_old_reservations(); Type: PROCEDURE; Schema: public; Owner: avnadmin
--

CREATE PROCEDURE public.delete_old_reservations()
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM reservations
    WHERE res_date <= CURRENT_DATE AND res_time_end <= CURRENT_TIME;
END;
$$;


ALTER PROCEDURE public.delete_old_reservations() OWNER TO avnadmin;

--
-- Name: set_res_time_end(); Type: FUNCTION; Schema: public; Owner: avnadmin
--

CREATE FUNCTION public.set_res_time_end() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.res_time_end := NEW.res_time_start + INTERVAL '30 minute';
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_res_time_end() OWNER TO avnadmin;

--
-- Name: update_mem_type(); Type: FUNCTION; Schema: public; Owner: avnadmin
--

CREATE FUNCTION public.update_mem_type() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.point < 1000 THEN
        NEW.mem_type = 'Bronze';
    ELSIF NEW.point >= 1000 AND NEW.point < 3000 THEN
        NEW.mem_type = 'Silver';
    ELSIF NEW.point >= 3000 AND NEW.point < 5000 THEN
        NEW.mem_type = 'Gold';
    ELSIF NEW.point >= 5000 THEN
        NEW.mem_type = 'Diamond';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_mem_type() OWNER TO avnadmin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.categories (
    category_id bigint NOT NULL,
    category_name character varying(255) NOT NULL
);


ALTER TABLE public.categories OWNER TO avnadmin;

--
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.categories_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_category_id_seq OWNER TO avnadmin;

--
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.customers (
    customer_id bigint NOT NULL,
    name character varying(255),
    gender character varying(255),
    phone character varying(255) NOT NULL,
    address character varying(255),
    point bigint DEFAULT 0,
    mem_type character varying(255) DEFAULT 'Bronze'::character varying
);


ALTER TABLE public.customers OWNER TO avnadmin;

--
-- Name: customers_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.customers_customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customers_customer_id_seq OWNER TO avnadmin;

--
-- Name: customers_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.customers_customer_id_seq OWNED BY public.customers.customer_id;


--
-- Name: dishes; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.dishes (
    dish_id bigint NOT NULL,
    dish_name character varying(255),
    description character varying(255),
    price numeric(10,2),
    dish_status integer DEFAULT 0,
    category_id bigint,
    menu_id bigint,
    CONSTRAINT dishes_dish_status_check CHECK ((dish_status = ANY (ARRAY[0, 1])))
);


ALTER TABLE public.dishes OWNER TO avnadmin;

--
-- Name: dishes_dish_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.dishes_dish_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dishes_dish_id_seq OWNER TO avnadmin;

--
-- Name: dishes_dish_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.dishes_dish_id_seq OWNED BY public.dishes.dish_id;


--
-- Name: event_dishes; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.event_dishes (
    event_id bigint NOT NULL,
    dish_id bigint NOT NULL
);


ALTER TABLE public.event_dishes OWNER TO avnadmin;

--
-- Name: events; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.events (
    event_id bigint NOT NULL,
    event_name character varying(255) NOT NULL,
    description text,
    begin_time date DEFAULT CURRENT_DATE,
    close_time date,
    poster character varying(255),
    status character varying(10) DEFAULT 'Active'::character varying
);


ALTER TABLE public.events OWNER TO avnadmin;

--
-- Name: events_event_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.events_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.events_event_id_seq OWNER TO avnadmin;

--
-- Name: events_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.events_event_id_seq OWNED BY public.events.event_id;


--
-- Name: membership_levels; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.membership_levels (
    mem_type character varying(255) NOT NULL,
    point_threshold bigint NOT NULL,
    accumulation numeric(4,2) NOT NULL
);


ALTER TABLE public.membership_levels OWNER TO avnadmin;

--
-- Name: menus; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.menus (
    menu_id bigint NOT NULL,
    menu_name character varying(255) NOT NULL
);


ALTER TABLE public.menus OWNER TO avnadmin;

--
-- Name: menus_menu_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.menus_menu_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.menus_menu_id_seq OWNER TO avnadmin;

--
-- Name: menus_menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.menus_menu_id_seq OWNED BY public.menus.menu_id;


--
-- Name: order_dishes; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.order_dishes (
    order_id bigint NOT NULL,
    dish_id bigint NOT NULL,
    quantity bigint
);


ALTER TABLE public.order_dishes OWNER TO avnadmin;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.orders (
    order_id bigint NOT NULL,
    customer_id bigint,
    phone character varying(255),
    order_date date,
    order_time time without time zone,
    order_status integer DEFAULT 0,
    total_price numeric(10,2) DEFAULT 0,
    has_children boolean DEFAULT false,
    final_price numeric(10,2) DEFAULT 0,
    CONSTRAINT orders_order_status_check CHECK ((order_status = ANY (ARRAY[0, 1, 2, 3])))
);


ALTER TABLE public.orders OWNER TO avnadmin;

--
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.orders_order_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_order_id_seq OWNER TO avnadmin;

--
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- Name: reservations; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.reservations (
    res_id bigint NOT NULL,
    phone character varying(255) NOT NULL,
    table_id bigint,
    res_date date DEFAULT CURRENT_DATE,
    res_time_start time without time zone DEFAULT LOCALTIME(0),
    res_time_end time without time zone,
    CONSTRAINT reservations_check CHECK ((res_time_start < res_time_end))
);


ALTER TABLE public.reservations OWNER TO avnadmin;

--
-- Name: reservations_res_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.reservations_res_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reservations_res_id_seq OWNER TO avnadmin;

--
-- Name: reservations_res_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.reservations_res_id_seq OWNED BY public.reservations.res_id;


--
-- Name: tables; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.tables (
    table_id bigint NOT NULL,
    capacity integer NOT NULL,
    table_status integer DEFAULT 0,
    CONSTRAINT tables_table_status_check CHECK ((table_status = ANY (ARRAY[0, 1, 2, 3])))
);


ALTER TABLE public.tables OWNER TO avnadmin;

--
-- Name: tables_table_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.tables_table_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tables_table_id_seq OWNER TO avnadmin;

--
-- Name: tables_table_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.tables_table_id_seq OWNED BY public.tables.table_id;


--
-- Name: toys; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.toys (
    toy_id bigint NOT NULL,
    toy_name character varying(255) NOT NULL,
    quantity bigint NOT NULL
);


ALTER TABLE public.toys OWNER TO avnadmin;

--
-- Name: toys_toy_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.toys_toy_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.toys_toy_id_seq OWNER TO avnadmin;

--
-- Name: toys_toy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.toys_toy_id_seq OWNED BY public.toys.toy_id;


--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: customers customer_id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.customers ALTER COLUMN customer_id SET DEFAULT nextval('public.customers_customer_id_seq'::regclass);


--
-- Name: dishes dish_id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.dishes ALTER COLUMN dish_id SET DEFAULT nextval('public.dishes_dish_id_seq'::regclass);


--
-- Name: events event_id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.events ALTER COLUMN event_id SET DEFAULT nextval('public.events_event_id_seq'::regclass);


--
-- Name: menus menu_id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.menus ALTER COLUMN menu_id SET DEFAULT nextval('public.menus_menu_id_seq'::regclass);


--
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- Name: reservations res_id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.reservations ALTER COLUMN res_id SET DEFAULT nextval('public.reservations_res_id_seq'::regclass);


--
-- Name: tables table_id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.tables ALTER COLUMN table_id SET DEFAULT nextval('public.tables_table_id_seq'::regclass);


--
-- Name: toys toy_id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.toys ALTER COLUMN toy_id SET DEFAULT nextval('public.toys_toy_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.categories (category_id, category_name) FROM stdin;
1	Main Course
2	Side Dish
3	Dessert
4	Beverage
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.customers (customer_id, name, gender, phone, address, point, mem_type) FROM stdin;
1	Lorne Ibert	Male	0695953619	71 Laurel Circle	0	Bronze
2	Morgan Pailin	Female	0330039472	664 Maywood Way	0	Bronze
3	Eada Djorevic	Female	0319019443	989 Chinook Road	0	Bronze
4	Orland Cheale	Male	0225156387	787 Ridgeway Place	0	Bronze
5	Garrot McMichell	Male	0843693605	9 Dahle Hill	0	Bronze
6	Lanie Strawbridge	Male	0871204928	4 Bluejay Parkway	0	Bronze
7	Lara Meak	Female	0578568451	390 Prairie Rose Point	0	Bronze
8	Maudie Dibbe	Female	0975053916	0558 Warrior Center	0	Bronze
9	Leon Maclaine	Male	0862131673	0 Sugar Road	0	Bronze
10	Nickie Rabson	Male	0341757865	81 Mcbride Crossing	0	Bronze
11	Halli Weldrake	Female	0512240906	0015 Forest Run Junction	0	Bronze
12	Vina Swateridge	Female	0484322882	3206 Linden Pass	0	Bronze
13	Godart Mundell	Male	0896438562	9879 Debs Hill	0	Bronze
14	Lovell Gowdy	Male	0807607584	1 Hagan Alley	0	Bronze
15	Cary Kuschek	Male	0687123463	84 Brown Parkway	0	Bronze
16	Betty Condie	Female	0549105390	474 Mayer Way	0	Bronze
17	Charmine Westell	Female	0817973251	84449 Di Loreto Plaza	0	Bronze
18	Pattin Runsey	Male	0859756213	24393 Morningstar Point	0	Bronze
19	Anallese Bayfield	Female	0581578574	978 Michigan Court	0	Bronze
20	Wilhelmina Bertolin	Female	0560964099	2 American Lane	0	Bronze
21	Rochette Wallsworth	Female	0567512525	46117 Springs Pass	0	Bronze
22	Lizabeth McKillop	Female	0242135840	953 Bluestem Plaza	0	Bronze
23	Mattie Renvoys	Female	0531544555	15 Gulseth Street	0	Bronze
24	Sella Hartill	Female	0316378543	08 Rutledge Street	0	Bronze
25	Mirella Geistbeck	Female	0501426510	23 Kings Road	0	Bronze
26	Kevina Winnister	Female	0910727356	5 Crescent Oaks Point	0	Bronze
27	Garik Powder	Male	0468147551	5 Marquette Way	0	Bronze
28	Casar Gehringer	Male	0318371129	2382 5th Street	0	Bronze
29	Walt Teare	Male	0817237267	51975 Rusk Trail	0	Bronze
30	Collin Fritchley	Male	0879989472	6851 Lukken Hill	0	Bronze
\.


--
-- Data for Name: dishes; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.dishes (dish_id, dish_name, description, price, dish_status, category_id, menu_id) FROM stdin;
1	Fish & Chips	\N	10.00	0	1	1
2	Spaghetti	\N	15.00	0	1	1
3	Pizza	\N	20.00	0	1	1
4	Lasagna	\N	20.00	0	1	1
5	Tacos	\N	15.00	0	1	1
6	Steak	\N	30.00	0	1	1
7	Barbecue ribs	\N	35.00	0	1	1
8	Fried chicken	\N	30.00	0	1	1
9	Grilled salmon	\N	35.00	0	1	1
10	Grilled chicken	\N	35.00	0	1	1
11	Mashed potatoes	\N	10.00	0	2	2
12	French fries	\N	15.00	0	2	2
13	Baked potatoes	\N	10.00	0	2	2
14	Baked beans	\N	15.00	0	2	2
15	Roasted garlic bread	\N	15.00	0	2	2
16	Potato salad	\N	15.00	0	2	2
17	Steamed broccoli	\N	15.00	0	2	2
18	Grilled asparagus	\N	15.00	0	2	2
19	Creamed spinach	\N	15.00	0	2	2
20	Grilled vegetables	\N	15.00	0	2	2
21	Chocolate cake	\N	25.00	0	3	3
22	Cheesecake	\N	20.00	0	3	3
23	Ice cream	\N	15.00	0	3	3
24	Pudding	\N	15.00	0	3	3
25	Apple pie	\N	20.00	0	3	3
26	Custard	\N	20.00	0	3	3
27	Cupcakes	\N	15.00	0	3	3
28	Tiramisu	\N	20.00	0	3	3
29	Mousse	\N	20.00	0	3	3
30	Banana bread	\N	25.00	0	3	3
31	Water	\N	15.00	0	4	4
32	Soda	\N	25.00	0	4	4
33	Juice	\N	30.00	0	4	4
34	Tea	\N	25.00	0	4	4
35	Wine	\N	40.00	0	4	4
36	Beer	\N	35.00	0	4	4
37	Hot chocolate	\N	20.00	0	4	4
38	Milk	\N	20.00	0	4	4
39	Coffee	\N	25.00	0	4	4
40	Smoothies	\N	30.00	0	4	4
\.


--
-- Data for Name: event_dishes; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.event_dishes (event_id, dish_id) FROM stdin;
1	20
1	21
1	22
1	25
1	40
2	2
2	3
2	4
2	36
2	37
3	9
3	10
3	13
3	14
3	15
4	6
4	16
4	17
4	18
4	33
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.events (event_id, event_name, description, begin_time, close_time, poster, status) FROM stdin;
7	ABCD	\N	2023-08-15	2023-11-15	\N	Active
6	Con Nhi Dien	\N	2023-08-15	2023-11-15	\N	Active
1	Birthday	The birthday of restaurant	2023-08-15	2023-11-15	\N	Active
2	Anniversary	The anniversary	2023-08-15	2023-11-15	\N	Active
3	Wedding	The wedding party	2023-08-15	2023-11-15	\N	Active
4	Graduation	Graduation reason	2023-08-15	2023-11-15	\N	Active
8	ABCD	\N	2023-08-15	\N	\N	Active
9	ABCDEF	\N	2023-08-15	\N	\N	Active
10	event2	\N	2023-08-15	\N	\N	Active
\.


--
-- Data for Name: membership_levels; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.membership_levels (mem_type, point_threshold, accumulation) FROM stdin;
Bronze	0	0.10
Silver	1000	0.15
Gold	3000	0.20
Diamond	5000	0.25
\.


--
-- Data for Name: menus; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.menus (menu_id, menu_name) FROM stdin;
1	Main Menu
2	Side Menu
3	Dessert Menu
4	Beverage Menu
\.


--
-- Data for Name: order_dishes; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.order_dishes (order_id, dish_id, quantity) FROM stdin;
1	6	2
2	1	1
3	2	3
4	32	2
5	20	2
6	39	3
7	10	3
8	16	2
9	20	3
10	28	3
11	15	1
13	34	1
14	6	2
15	5	3
16	8	3
17	37	3
18	10	2
19	20	1
20	13	1
21	27	1
22	40	1
23	29	3
24	1	3
25	3	2
26	30	2
27	36	1
28	36	2
29	19	2
30	11	2
32	5	3
33	37	2
34	29	1
35	37	2
36	34	1
37	15	1
38	31	2
39	35	3
40	15	2
41	39	2
42	3	3
43	4	3
44	21	2
45	5	1
46	3	2
47	36	3
48	21	2
49	39	2
50	26	3
1	29	1
2	31	3
3	25	1
4	38	2
5	35	2
6	37	2
7	9	1
8	19	3
9	35	1
10	14	1
11	29	3
13	22	2
14	23	2
15	39	3
16	25	2
17	25	3
18	36	2
19	2	3
20	3	3
21	38	3
22	24	2
23	38	1
24	23	1
25	30	1
26	15	3
27	14	1
28	6	3
29	32	1
30	3	2
32	35	3
33	23	3
34	5	2
35	9	1
36	39	1
37	19	3
38	24	2
39	38	3
40	32	2
41	27	3
42	38	1
43	9	2
44	40	3
45	19	2
46	34	2
47	12	1
48	18	1
49	37	3
50	27	3
1	31	2
2	27	1
3	21	2
4	9	2
5	5	3
6	5	2
7	17	1
8	21	3
9	29	1
10	12	1
11	36	2
13	9	2
14	24	1
15	6	3
16	1	1
17	7	2
18	27	1
19	12	2
20	7	3
21	17	1
22	28	3
23	35	1
24	20	2
25	32	2
26	25	3
27	7	3
28	40	1
29	35	3
30	23	2
32	18	3
33	14	3
34	8	2
35	24	3
36	16	2
37	18	1
38	14	2
39	17	1
40	8	2
41	3	2
42	13	3
43	39	1
44	7	3
45	20	2
46	18	1
47	17	1
48	32	1
49	8	2
50	30	2
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.orders (order_id, customer_id, phone, order_date, order_time, order_status, total_price, has_children, final_price) FROM stdin;
1	\N	0272138417	2022-08-14	19:04:00	0	389.00	t	396.78
2	\N	0283943804	2022-05-01	19:20:00	0	422.00	t	430.44
3	\N	0731135308	2022-02-14	18:07:00	0	256.00	t	261.12
4	\N	0751683578	2022-08-19	18:20:00	0	462.00	f	471.24
5	\N	0924024602	2022-01-31	18:28:00	0	223.00	f	227.46
6	\N	0310318753	2022-06-05	18:27:00	0	396.00	t	403.92
7	1	0695953619	2023-01-22	18:23:00	0	174.00	f	177.48
8	\N	0344540669	2022-06-08	18:34:00	0	250.00	t	255.00
9	\N	0296030089	2022-11-28	18:32:00	0	211.00	t	215.22
10	\N	0866188244	2022-04-12	19:16:00	0	380.00	t	387.60
11	\N	0535946431	2022-09-11	19:29:00	0	339.00	t	345.78
13	\N	0698275009	2022-11-12	18:28:00	0	275.00	t	280.50
14	\N	0752280604	2022-12-01	18:23:00	0	337.00	t	343.74
15	\N	0830672195	2022-09-09	18:02:00	0	354.00	f	361.08
16	\N	0575872220	2022-06-15	19:26:00	0	375.00	f	382.50
17	\N	0520944850	2022-10-31	19:16:00	0	109.00	f	111.18
18	\N	0858486335	2023-02-15	18:12:00	0	276.00	f	281.52
19	\N	0829728213	2023-01-03	18:41:00	0	437.00	t	445.74
20	\N	0337944063	2022-08-18	18:02:00	0	269.00	f	274.38
21	\N	0313098924	2022-02-27	19:04:00	0	386.00	t	393.72
22	\N	0495494645	2023-01-22	19:24:00	0	180.00	f	183.60
23	\N	0215514742	2022-10-31	18:53:00	0	174.00	f	177.48
24	\N	0655181870	2022-08-06	18:01:00	0	317.00	f	323.34
25	\N	0910814691	2022-10-03	18:17:00	0	245.00	f	249.90
26	\N	0899911776	2022-06-19	18:36:00	0	141.00	f	143.82
27	\N	0915282408	2023-01-23	18:50:00	0	419.00	f	427.38
28	\N	0850874807	2023-03-11	19:18:00	0	480.00	t	489.60
29	\N	0957494493	2022-11-18	19:07:00	0	298.00	f	303.96
30	\N	0809451217	2022-02-01	18:44:00	0	126.00	t	128.52
32	\N	0902659621	2022-12-24	18:47:00	0	104.00	t	106.08
33	\N	0560965859	2023-02-06	18:20:00	0	258.00	f	263.16
34	\N	0391406514	2022-05-25	18:40:00	0	205.00	t	209.10
35	\N	0715828416	2022-12-25	19:29:00	0	441.00	f	449.82
36	\N	0286408859	2023-01-09	18:22:00	0	130.00	f	132.60
37	\N	0851988318	2023-03-18	18:31:00	0	439.00	t	447.78
38	\N	0335030314	2022-12-09	18:01:00	0	147.00	t	149.94
39	\N	0606683531	2022-03-23	18:03:00	0	171.00	t	174.42
40	\N	0408402419	2022-06-08	18:39:00	0	236.00	f	240.72
41	\N	0577980535	2023-01-14	18:27:00	0	345.00	f	351.90
42	\N	0412305819	2022-10-21	18:50:00	0	185.00	f	188.70
43	\N	0349695246	2022-08-27	19:10:00	0	164.00	t	167.28
44	\N	0964936158	2023-03-21	18:25:00	0	276.00	t	281.52
45	\N	0248832066	2022-10-25	18:24:00	0	237.00	f	241.74
46	\N	0561059498	2022-08-07	18:04:00	0	465.00	f	474.30
47	\N	0586986863	2022-07-25	18:55:00	0	363.00	t	370.26
48	\N	0665761849	2023-02-03	18:57:00	0	357.00	t	364.14
49	\N	0402535358	2022-09-21	18:42:00	0	349.00	t	355.98
50	\N	0248884828	2022-10-28	18:42:00	0	441.00	t	449.82
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.reservations (res_id, phone, table_id, res_date, res_time_start, res_time_end) FROM stdin;
1	0695953619	34	2023-05-17	13:00:00	13:30:00
6	0361503580	5	2023-05-24	10:00:00	10:30:00
7	0223302153	12	2023-05-19	10:00:00	10:30:00
9	0547856992	48	2023-05-24	10:00:00	10:30:00
10	0709877119	37	2023-05-21	10:00:00	10:30:00
13	0835516059	47	2023-05-26	10:00:00	10:30:00
14	0566859983	6	2023-05-26	10:00:00	10:30:00
15	0868037128	39	2023-05-26	10:00:00	10:30:00
18	0766984371	43	2023-05-24	10:00:00	10:30:00
20	0732261274	25	2023-05-18	10:00:00	10:30:00
21	0527407342	34	2023-05-29	10:00:00	10:30:00
22	0585755341	21	2023-05-18	10:00:00	10:30:00
25	0254170595	48	2023-05-28	10:00:00	10:30:00
26	0229885498	55	2023-05-19	10:00:00	10:30:00
27	0967629811	31	2023-05-27	10:00:00	10:30:00
28	0661301909	16	2023-05-22	10:00:00	10:30:00
29	0690986431	6	2023-05-21	10:00:00	10:30:00
31	0672480567	16	2023-05-24	10:00:00	10:30:00
32	0258845819	1	2023-05-20	10:00:00	10:30:00
34	0368757436	17	2023-05-18	10:00:00	10:30:00
36	0718448062	1	2023-05-28	10:00:00	10:30:00
37	0853037348	15	2023-05-26	10:00:00	10:30:00
38	0553202740	50	2023-05-18	10:00:00	10:30:00
39	0679314587	52	2023-05-21	10:00:00	10:30:00
42	0976363399	24	2023-05-22	10:00:00	10:30:00
43	0960597672	50	2023-05-22	10:00:00	10:30:00
44	0905239389	8	2023-05-28	10:00:00	10:30:00
47	0862054102	48	2023-05-27	10:00:00	10:30:00
50	0706778279	37	2023-05-21	10:00:00	10:30:00
\.


--
-- Data for Name: tables; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.tables (table_id, capacity, table_status) FROM stdin;
1	4	0
2	4	0
3	4	0
4	4	0
5	4	0
6	4	0
7	4	0
8	4	0
9	4	0
10	4	0
11	4	0
12	4	0
13	4	0
14	4	0
15	4	0
16	4	0
17	4	0
18	4	0
19	4	0
20	4	0
21	4	0
22	4	0
23	4	0
24	4	0
25	4	0
26	4	0
27	4	0
28	4	0
29	4	0
30	4	0
31	8	0
32	8	0
33	8	0
34	8	0
35	8	0
36	8	0
37	8	0
38	8	0
39	8	0
40	8	0
41	8	0
42	8	0
43	8	0
44	8	0
45	8	0
46	8	0
47	8	0
48	8	0
49	8	0
50	8	0
51	10	0
52	10	0
53	10	0
54	10	0
55	10	0
\.


--
-- Data for Name: toys; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.toys (toy_id, toy_name, quantity) FROM stdin;
1	Lego	100
2	Barbie	100
3	Hot Wheels	100
4	Nerf	100
5	Play-Doh	100
6	Furby	100
7	Tamagotchi	100
8	Mr. Potato Head	100
9	Rubik Cube	100
10	Hatchimals	100
\.


--
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 4, true);


--
-- Name: customers_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.customers_customer_id_seq', 10213, true);


--
-- Name: dishes_dish_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.dishes_dish_id_seq', 40, true);


--
-- Name: events_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.events_event_id_seq', 14, true);


--
-- Name: menus_menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.menus_menu_id_seq', 4, true);


--
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 200, true);


--
-- Name: reservations_res_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.reservations_res_id_seq', 50, true);


--
-- Name: tables_table_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.tables_table_id_seq', 55, true);


--
-- Name: toys_toy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.toys_toy_id_seq', 10, true);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: customers customers_phone_key; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key UNIQUE (phone);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customer_id);


--
-- Name: dishes dishes_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.dishes
    ADD CONSTRAINT dishes_pkey PRIMARY KEY (dish_id);


--
-- Name: event_dishes event_dishes_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.event_dishes
    ADD CONSTRAINT event_dishes_pkey PRIMARY KEY (event_id, dish_id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (event_id);


--
-- Name: membership_levels membership_levels_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.membership_levels
    ADD CONSTRAINT membership_levels_pkey PRIMARY KEY (mem_type);


--
-- Name: menus menus_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT menus_pkey PRIMARY KEY (menu_id);


--
-- Name: order_dishes order_dishes_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.order_dishes
    ADD CONSTRAINT order_dishes_pkey PRIMARY KEY (order_id, dish_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (res_id);


--
-- Name: tables tables_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_pkey PRIMARY KEY (table_id);


--
-- Name: toys toys_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.toys
    ADD CONSTRAINT toys_pkey PRIMARY KEY (toy_id);


--
-- Name: orders compute_final_price_trigger; Type: TRIGGER; Schema: public; Owner: avnadmin
--

CREATE TRIGGER compute_final_price_trigger BEFORE INSERT OR UPDATE OF total_price ON public.orders FOR EACH ROW EXECUTE FUNCTION public.compute_final_price();


--
-- Name: reservations set_res_time_end_trigger; Type: TRIGGER; Schema: public; Owner: avnadmin
--

CREATE TRIGGER set_res_time_end_trigger BEFORE INSERT ON public.reservations FOR EACH ROW EXECUTE FUNCTION public.set_res_time_end();


--
-- Name: customers update_mem_type_trigger; Type: TRIGGER; Schema: public; Owner: avnadmin
--

CREATE TRIGGER update_mem_type_trigger BEFORE INSERT OR UPDATE OF point ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_mem_type();


--
-- Name: dishes fk_category_id; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.dishes
    ADD CONSTRAINT fk_category_id FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE CASCADE;


--
-- Name: orders fk_customer_id; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id) ON DELETE CASCADE;


--
-- Name: event_dishes fk_dish_id; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.event_dishes
    ADD CONSTRAINT fk_dish_id FOREIGN KEY (dish_id) REFERENCES public.dishes(dish_id) ON DELETE CASCADE;


--
-- Name: order_dishes fk_dish_id; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.order_dishes
    ADD CONSTRAINT fk_dish_id FOREIGN KEY (dish_id) REFERENCES public.dishes(dish_id) ON DELETE CASCADE;


--
-- Name: event_dishes fk_event_id; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.event_dishes
    ADD CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES public.events(event_id) ON DELETE CASCADE;


--
-- Name: customers fk_mem_type; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT fk_mem_type FOREIGN KEY (mem_type) REFERENCES public.membership_levels(mem_type) ON DELETE CASCADE;


--
-- Name: dishes fk_menu_id; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.dishes
    ADD CONSTRAINT fk_menu_id FOREIGN KEY (menu_id) REFERENCES public.menus(menu_id) ON DELETE CASCADE;


--
-- Name: order_dishes fk_order_id; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.order_dishes
    ADD CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- Name: reservations fk_table_id; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT fk_table_id FOREIGN KEY (table_id) REFERENCES public.tables(table_id) ON DELETE CASCADE;


--
-- avnadminQL database dump complete
--

