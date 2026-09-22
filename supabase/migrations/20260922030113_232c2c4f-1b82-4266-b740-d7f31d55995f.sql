CREATE TEMP TABLE _cc AS
SELECT upper(state) st, lower(city) city, avg(lat) lat, avg(lon) lon FROM zip_centroids GROUP BY 1,2;

CREATE TEMP TABLE _far AS
SELECT b.id, upper(b.state) st, lower(b.city) city, b.zip_code
FROM businesses b JOIN _cc c ON c.st = upper(b.state) AND c.city = lower(b.city)
WHERE b.country = 'US' AND b.latitude IS NOT NULL
  AND 3958.8*2*asin(sqrt(power(sin(radians(b.latitude-c.lat)/2),2)
      + cos(radians(c.lat))*cos(radians(b.latitude))*power(sin(radians(b.longitude-c.lon)/2),2))) > 50;

UPDATE businesses b SET latitude = z.lat, longitude = z.lon
FROM _far f JOIN zip_centroids z
  ON z.zip = substring(f.zip_code from '^[0-9]{5}') AND upper(z.state) = f.st
WHERE b.id = f.id;

UPDATE businesses b SET latitude = c.lat, longitude = c.lon
FROM _far f JOIN _cc c ON c.st = f.st AND c.city = f.city
WHERE b.id = f.id
  AND NOT EXISTS (
    SELECT 1 FROM zip_centroids z2
    WHERE z2.zip = substring(f.zip_code from '^[0-9]{5}') AND upper(z2.state) = f.st);