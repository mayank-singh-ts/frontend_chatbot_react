
set @fromstation='Rohini West';
set @tostation='Kashmere Gate';
select GROUP_CONCAT(station_name, '') AS all_names,SUM(fare) as TotalFare from (
select *,ROW_NUMBER() OVER (ORDER BY ID asc) AS row_num from (
select distinct *
     from (
select r.destination_station_id as ID from routes r
where r.source_station_id>=(select s.station_id from stations s where s.station_name=@fromstation)
and r.destination_station_id<=(select s.station_id from stations s where s.station_name=@tostation)
union all
select r.source_station_id as ID from routes r
where r.source_station_id>=(select s.station_id from stations s where s.station_name=@fromstation)
and r.destination_station_id<=(select s.station_id from stations s where s.station_name=@tostation)
) as t order by ID
) as a
inner join stations s on s.station_id=a.ID
inner join fares f on f.source_station_id =a.ID
) as result;

-- pythent check resul 0


set @fromstation='Kashmere Gate';
set @tostation='Rohini West';

select GROUP_CONCAT(station_name, '') AS all_names,SUM(fare) as TotalFare from (
SELECT *,ROW_NUMBER() OVER (ORDER BY ID desc) AS row_num from (
select distinct *
     from (
select r.destination_station_id as ID from routes r
where r.source_station_id>=(select s.station_id from stations s where s.station_name=@tostation)
and r.destination_station_id<=(select s.station_id from stations s where s.station_name=@fromstation)
union all
select r.source_station_id as ID from routes r
where r.source_station_id>=(select s.station_id from stations s where s.station_name=@tostation)
and r.destination_station_id<=(select s.station_id from stations s where s.station_name=@fromstation)
) as t order by ID
) as a
inner join stations s on s.station_id=a.ID
inner join fares f on f.source_station_id =a.ID
) as tt

