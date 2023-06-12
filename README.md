[![Deploy to Firebase Hosting on PR](https://github.com/Wolk9/kiku/actions/workflows/firebase-hosting-pull-request.yml/badge.svg)](https://github.com/Wolk9/kiku/actions/workflows/firebase-hosting-pull-request.yml)

# Kiku

Kiku staat voor Klok In Klok Uit en is ontwikkeld om de uren bij te houden voor Dasko medewerkers die moeten inklokken en uitklokken.

## Objectives



## Techniek
Het is geschreven in JavaScript React mbv Material Design Bootstrap (MDB) en wat eigen CSS aanpassingen. 

## ToDo's:

- Een running event moet nog gelogd worden in de database zodat bij het verlaten van de app het event gewoon door blijft lopen. Nu is de running event een useState die weer wordt overschreven zodra er een rerender is; bijvoorbeeld bij het herladen.
Om dat te ondervangen moet er na de useState registratie ook een doc worden weggeschreven in de FireBase Store. Dit houdt echter in dat de EvenList een filter moet krijgen die alleen de afgesloten events fetcht, en dat bij terugkomst er eerst in de datastore moet wroden gekeken of er een event open staat en zo ja dat deze de lokae useState weer vult met de informatie. 
- Er moeten meerdere gebruikers gebruik kunnen maken van de app, tegelijkertijd.

- Er moet minimaal een gebruiker zijn die andere gebruikers kan modereren. (User management)

- naast inloggen moeten gebruikers zich ook kunnen registeren.

- Events moeten later aanpasbaar zijn om correcties uit te kunnen voeren.

- Er moet een lopende timer zichtbaar zijn die aangeeft hoe lang een event al actief is.

- afgesloten events moeten aangeven hoeveel uren en minuten er in totaal is geregistreerd.

- Er moeten in een later staduim overzichten gegenereerd kunnen worden op basis van dag, week, maand, jaar, maar ook op basis van type activiteit en of lenge van activiteiten. In de UI is stap een, maar liefst ook exports in PDF.

