# command_and_control

# Command and Control API
**Boilerplate by Jacob Beneski**<br>
**Maintained/Implemented by David Padilla-Arenivar**

*This repository is a small part of a team-based project for my Software Engineering II
course at St. Edward's University, and involved creating a cloud-based system to track
data from a mock wind turbine to asses various KPIs (rotor speed, gearbox temperature, etc.)
to alert the user of issues.*

*The system was designed with wind farm preventative maintenance in mind, and featured 
an online dashboard that would serve as a hub for all the information presented/stored 
by this central API.*

 * This repository houses the main CaC API, which allows for the storing and 
 retrieving of data from the shared database. Currently, the information
 involved only relates to heartbeat and diagnostic objects, which contain
 basic device diagnostic information generated by the IoT device and collected
 by the Gateway.
 ##For documentation on the API handlers used in this file, go to:
https://documenter.getpostman.com/view/6699578/SVtPXWHF?version=latest
