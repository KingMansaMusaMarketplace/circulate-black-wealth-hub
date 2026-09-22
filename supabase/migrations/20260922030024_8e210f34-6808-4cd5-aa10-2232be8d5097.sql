CREATE TEMP TABLE _sb(st text, minlat double precision, maxlat double precision, minlon double precision, maxlon double precision);
INSERT INTO _sb VALUES
('AL',30.1,35.1,-88.6,-84.8),('AK',51.0,71.6,-179.9,-129.9),('AZ',31.2,37.1,-115.0,-108.9),('AR',33.0,36.6,-94.7,-89.6),('CA',32.4,42.1,-124.5,-114.1),('CO',36.9,41.1,-109.1,-102.0),('CT',40.9,42.1,-73.8,-71.7),('DE',38.4,39.9,-75.8,-74.9),('DC',38.7,39.1,-77.2,-76.8),('FL',24.4,31.1,-87.7,-79.9),('GA',30.3,35.1,-85.7,-80.8),('HI',18.8,22.3,-160.3,-154.7),('ID',41.9,49.1,-117.3,-110.9),('IL',36.9,42.6,-91.6,-87.4),('IN',37.7,41.9,-88.2,-84.7),('IA',40.3,43.6,-96.7,-90.1),('KS',36.9,40.1,-102.1,-94.5),('KY',36.4,39.2,-89.6,-81.9),('LA',28.8,33.1,-94.1,-88.7),('ME',42.9,47.6,-71.2,-66.9),('MD',37.8,39.8,-79.5,-74.9),('MA',41.1,42.9,-73.6,-69.8),('MI',41.6,48.3,-90.5,-82.3),('MN',43.4,49.5,-97.3,-89.4),('MS',30.1,35.1,-91.7,-88.0),('MO',35.9,40.7,-95.8,-89.0),('MT',44.3,49.1,-116.1,-104.0),('NE',39.9,43.1,-104.1,-95.2),('NV',35.0,42.1,-120.1,-114.0),('NH',42.6,45.4,-72.6,-70.5),('NJ',38.8,41.4,-75.6,-73.8),('NM',31.2,37.1,-109.1,-102.9),('NY',40.4,45.1,-79.8,-71.8),('NC',33.8,36.6,-84.4,-75.4),('ND',45.9,49.1,-104.1,-96.5),('OH',38.3,42.4,-84.9,-80.4),('OK',33.6,37.1,-103.1,-94.4),('OR',41.9,46.4,-124.6,-116.4),('PA',39.7,42.4,-80.6,-74.6),('RI',41.1,42.1,-71.9,-71.1),('SC',32.0,35.3,-83.4,-78.5),('SD',42.4,46.0,-104.1,-96.4),('TN',34.9,36.7,-90.4,-81.6),('TX',25.8,36.6,-106.7,-93.4),('UT',36.9,42.1,-114.1,-108.9),('VT',42.7,45.1,-73.5,-71.4),('VA',36.5,39.5,-83.7,-75.1),('WA',45.5,49.1,-124.9,-116.9),('WV',37.1,40.7,-82.7,-77.7),('WI',42.4,47.4,-92.9,-86.7),('WY',40.9,45.1,-111.1,-104.0),('PR',17.8,18.6,-67.3,-65.2);

CREATE TEMP TABLE _bad AS
SELECT b.id, upper(b.state) AS st, b.city, b.zip_code
FROM businesses b JOIN _sb s ON s.st = upper(b.state)
WHERE b.country = 'US' AND b.latitude IS NOT NULL
  AND (b.latitude NOT BETWEEN s.minlat AND s.maxlat
    OR b.longitude NOT BETWEEN s.minlon AND s.maxlon);

-- 1) re-pin from ZIP centroid when the ZIP belongs to the listing's state
UPDATE businesses b
SET latitude = z.lat, longitude = z.lon
FROM _bad x
JOIN zip_centroids z ON z.zip = substring(x.zip_code from '^[0-9]{5}') AND upper(z.state) = x.st
WHERE b.id = x.id;

-- 2) otherwise re-pin from the city centroid inside the same state
UPDATE businesses b
SET latitude = c.lat, longitude = c.lon
FROM _bad x
JOIN LATERAL (
  SELECT avg(z.lat) AS lat, avg(z.lon) AS lon
  FROM zip_centroids z
  WHERE upper(z.state) = x.st AND lower(z.city) = lower(x.city)
) c ON c.lat IS NOT NULL
WHERE b.id = x.id
  AND NOT EXISTS (
    SELECT 1 FROM zip_centroids z2
    WHERE z2.zip = substring(x.zip_code from '^[0-9]{5}') AND upper(z2.state) = x.st
  );

-- 3) anything still outside its state loses the false pin
UPDATE businesses b
SET latitude = NULL, longitude = NULL
FROM _bad x JOIN _sb s ON s.st = x.st
WHERE b.id = x.id AND b.latitude IS NOT NULL
  AND (b.latitude NOT BETWEEN s.minlat AND s.maxlat
    OR b.longitude NOT BETWEEN s.minlon AND s.maxlon);

-- 4) the single Bahamas listing pinned outside the Bahamas
UPDATE businesses SET latitude = NULL, longitude = NULL
WHERE country = 'BS' AND latitude IS NOT NULL
  AND NOT (latitude BETWEEN 20.8 AND 27.3 AND longitude BETWEEN -79.1 AND -72.6);