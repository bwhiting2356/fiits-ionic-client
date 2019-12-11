
# Fiits Front-End

[![Coverage Status](https://coveralls.io/repos/github/bwhiting2356/fiits-ionic-client/badge.svg?branch=master)](https://coveralls.io/github/bwhiting2356/fiits-ionic-client?branch=master) [![Build Status](https://travis-ci.org/bwhiting2356/fiits-ionic-client.svg?branch=master)](https://travis-ci.org/bwhiting2356/fiits-ionic-client) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=bwhiting2356_fiits-ionic-client&metric=alert_status)](https://sonarcloud.io/dashboard?id=bwhiting2356_fiits-ionic-client) 


[Fiits](https://fiits.bike) is a prototype of a public bike sharing redesign proposal with dynamic pricing and reservations.

### Background

[Public bike sharing]([https://en.wikipedia.org/wiki/Bicycle-sharing_system](https://en.wikipedia.org/wiki/Bicycle-sharing_system)) has rapidly expanded in the last decade, made possible by smartphone apps and smart locks for easy, one-way rentals for tourists or commuters. Almost every major city now has systems in place, some with hundreds of thousands of bikes in circulation. There are two main types, a stationless model (such as [Jump]([https://www.jump.com/](https://www.jump.com/)) or [Lime]([https://www.li.me/en-us/home](https://www.li.me/en-us/home))), and systems with stations, such as [Citibike]([https://www.citibikenyc.com/](https://www.citibikenyc.com/)), [BayWheels]([https://www.lyft.com/bikes/bay-wheels](https://www.lyft.com/bikes/bay-wheels)), or [Vélib']([https://www.velib-metropole.fr/en_GB](https://www.velib-metropole.fr/en_GB)).  

 #### Problems
 Issues with these systems are mainly due to their popularity. In a stationless systems, where bikes can be dropped off anywhere, streets can become cluttered with bikes, and public bike racks can become monopolized by bike share bikes. In the systems with stations, users often find stations completely empty or completely full, which makes the system harder to rely on for a commuter. Some systems employ staff to move bikes from from full to empty stations, but this is often expensive and inefficient, and still does not keep up with demand. Stations are often as large as an entire city block in order to accommodate the fluctuations in inventory throughout the day, and the size of these stations can be a barrier to expanding the system to other neighborhoods.

 #### Solutions

This project is a proof of concept for 2 solutions that could improve the system:

*1) Dynamic Pricing*

In the current model, some people's trips are more expensive than others. Bike trips in peak directions often incur costs to have the bike redistributed to another neighborhood by van. Bike trips in off-peak directions actually benefit the system. In this prototype, bike pickups from an almost empty station will incur the highest cost, as will drop-offs to an almost full station. On the other hand, pickups from a full station will pay out money to the commuter, as will drop-offs to an empty station

*2) Reservations*

Allowing users to book their bike rentals in advance will give commuters the certainty they need to use a bike share system regularly. Without reservations, most people will limit bike sharing to spontaneous leisure rentals, rather than their daily commute, and they will be unwilling to spend more for a better quality system. 

### Architecture

![Architecture](https://raw.githubusercontent.com/bwhiting2356/fiits-diagrams/master/Fiits%20Architecture.svg?sanitize=true)

The following additional repos are associated with this app:

-  [Backend (Java)](https://github.com/bwhiting2356/fiits-spring-boot)
-  [Firebase Cloud Functions (Node)](https://github.com/bwhiting2356/fiits-cloud-functions)
-  [Inventory Prediction Microservice (Node)](https://github.com/bwhiting2356/fiits-inventory-prediction)
-  [Admin Dashboard (Angular/Material)](https://github.com/bwhiting2356/fiits-cloud-functions)

### UX Flow

![UX Flow](https://raw.githubusercontent.com/bwhiting2356/fiits-diagrams/master/Fiits%20UX%20Flow.svg?sanitize=true)

[Pivotal Tracker Board](https://www.pivotaltracker.com/n/projects/2406737)


