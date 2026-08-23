-- ============================================================
-- Minarva Store — extra catalogue seed
-- Run once in Supabase Dashboard → SQL Editor → Run
-- Safe: uses ON CONFLICT (slug) DO NOTHING
-- ============================================================

insert into packages
  (name, slug, description, category_id, price, mrp, camera_count, dvr_type, storage, cable_length, highlights, weight_grams, featured, is_active, stock_status)
values
  ('4 Camera Home Kit', '4-camera-home-kit',
   'Complete 4-camera HD kit for medium homes. Night vision, remote view app support.',
   (select id from categories where slug='home-kits'),
   14999, 21999, 4, '4CH DVR', '1TB HDD', '90m',
   array['4 x 2MP HD Cameras','4 Channel DVR','1TB Hard Disk','Cables & adapters','Mobile app viewing','Free installation guide'],
   4200, true, true, 'in_stock'),
  ('8 Camera Shop Kit', '8-camera-shop-kit',
   '8-camera package ideal for shops and small offices. Expandable recorder.',
   (select id from categories where slug='shop-kits'),
   24999, 34999, 8, '8CH DVR', '2TB HDD', '160m',
   array['8 x 2MP HD Cameras','8 Channel DVR','2TB Hard Disk','All cables','Mobile & PC viewing'],
   7800, true, true, 'in_stock'),
  ('4 Camera Office NVR Kit', '4-camera-office-nvr',
   'IP camera kit with NVR for sharper video and remote management.',
   (select id from categories where slug='office-kits'),
   28999, 39999, 4, '4CH NVR', '2TB HDD', 'POE',
   array['4 x 4MP IP Cameras','4 Channel NVR','2TB Storage','PoE switch','Remote access'],
   5500, false, true, 'in_stock'),
  ('2 Camera Shop Starter', '2-camera-shop-starter',
   'Affordable 2-camera kit for small shops and counters.',
   (select id from categories where slug='shop-kits'),
   9999, 14999, 2, '4CH DVR', '500GB HDD', '40m',
   array['2 x 2MP Cameras','4CH DVR','500GB HDD','Cables included'],
   2800, false, true, 'in_stock')
on conflict (slug) do nothing;

insert into products
  (name, slug, description, category_id, brand, price, mrp, specs, weight_grams, featured, is_active, stock_status)
values
  ('2MP Bullet Camera Outdoor', '2mp-bullet-outdoor',
   'Weatherproof outdoor bullet camera with IR night vision up to 30m.',
   (select id from categories where slug='cameras'),
   'Minarva', 1499, 2199,
   '{"resolution":"2MP","type":"Bullet","night_vision":"30m","ip_rating":"IP66","warranty":"1 year"}'::jsonb,
   450, true, true, 'in_stock'),
  ('5MP Dome Camera', '5mp-dome-camera',
   'Higher resolution indoor/outdoor dome for clearer facial detail.',
   (select id from categories where slug='cameras'),
   'Minarva', 2499, 3299,
   '{"resolution":"5MP","type":"Dome","night_vision":"25m","warranty":"1 year"}'::jsonb,
   420, false, true, 'in_stock'),
  ('4 Channel HD DVR', '4ch-hd-dvr',
   '4-channel HD DVR with HDMI output and mobile app support.',
   (select id from categories where slug='dvr-nvr'),
   'Minarva', 3499, 4999,
   '{"channels":"4","max_resolution":"1080p","hdd_support":"up to 4TB","warranty":"1 year"}'::jsonb,
   900, true, true, 'in_stock'),
  ('8 Channel HD DVR', '8ch-hd-dvr',
   '8-channel recorder for shops and multi-floor homes.',
   (select id from categories where slug='dvr-nvr'),
   'Minarva', 5499, 7499,
   '{"channels":"8","max_resolution":"1080p","hdd_support":"up to 6TB","warranty":"1 year"}'::jsonb,
   1100, false, true, 'in_stock'),
  ('1TB Surveillance HDD', '1tb-surveillance-hdd',
   'Hard disk optimised for 24/7 CCTV recording.',
   (select id from categories where slug='accessories'),
   'Seagate/WD', 3999, 4999,
   '{"capacity":"1TB","type":"Surveillance","warranty":"2 years"}'::jsonb,
   450, true, true, 'in_stock'),
  ('90m CCTV Cable Kit', '90m-cable-kit',
   'Ready-made video + power cable set for 4 cameras (approx 90m total).',
   (select id from categories where slug='accessories'),
   'Generic', 1299, 1899,
   '{"length":"90m","type":"Siamese cable","connectors":"BNC + DC"}'::jsonb,
   2000, false, true, 'in_stock'),
  ('12V 5A Power Supply', '12v-5a-psu',
   'Central power supply for multiple analog cameras.',
   (select id from categories where slug='accessories'),
   'Generic', 699, 999,
   '{"output":"12V 5A","channels":"4-8","warranty":"6 months"}'::jsonb,
   600, false, true, 'in_stock'),
  ('2MP HD Dome Camera', '2mp-hd-dome-camera-v2',
   'Indoor 2MP HD dome with night vision — popular upgrade option.',
   (select id from categories where slug='cameras'),
   'Minarva', 1399, 1899,
   '{"resolution":"2MP","type":"Dome","night_vision":"20m","warranty":"1 year"}'::jsonb,
   400, false, true, 'in_stock')
on conflict (slug) do nothing;

-- Quick check
select 'packages' as t, count(*) from packages where is_active
union all
select 'products', count(*) from products where is_active;
