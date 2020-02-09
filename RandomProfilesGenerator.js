var faker = require('faker');
var Graph = require('./Graph');

class RandomProfilesGenerator {
    constructor(numberOfProfiles = 50, startingId = 101) {
        this.numberOfProfiles = numberOfProfiles;
        this.profilesList = [];
        this.connectionsList = [];
        this.startingId = startingId;
        this.graphInAdjList = new Graph(this.numberOfProfiles);
    }
    getRandomNumInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    }
    generateRandomProfiles() {
        for (var i=0; i<this.numberOfProfiles; i++) {
            // Generate Random Data
            var id = i + this.startingId,
                name = faker.name.findName(),
                avatar = faker.image.avatar(),
                dob = this.getValidDOB(), // Between 130 years ago and 13 years ago from today
                email = faker.internet.email(),
                phone = faker.phone.phoneNumberFormat(),
                streetAddress = faker.address.streetAddress(),
                city = faker.address.city(),
                zipCode = faker.address.zipCode(),
                country = faker.address.country(),
                homeIP = faker.internet.ipv6(),
                jobTitle = faker.name.jobTitle(),
                company = faker.company.companyName();
            // Set a profile with the random data
            var temp = {
                id: id,
                name: name,
                avatar: avatar,
                dob: dob,
                email: email,
                phone: phone,
                streetAddress: streetAddress,
                city: city,
                zipCode: zipCode,
                country: country,
                homeIP: homeIP,
                company: company,
                jobTitle: jobTitle,
                // Need to update these two later
                influence: 4,
                zone: 5
            };
            // Push the random profile to profilesList
            this.profilesList.push(temp);
            // Add a vertex to the graph
            this.graphInAdjList.addVertex(temp.id);
        }
    }

    // // Condition checking for duplicated links between two nodes in the undirected SN graph
    // checkForDuplicateLinksCondition(sourceId, targetId) {
    //     return this.connectionsList.find( function(element) {
    //         if (element.sourceId === sourceId && element.targetId === targetId) return true;
    //         if (element.sourceId === targetId && element.targetId === sourceId) return true;
    //         return false;
    //     });
    // }

    getMFYShuffledRConnection(source, sourceId, numberOfFriends) {
        var arr = [], len = this.numberOfProfiles, maxIndex = len-1, temp = 0, target = 0, targetId = 0;
        var currentVAdjList = this.graphInAdjList.getCurrentVAdjList(sourceId);

        if (currentVAdjList.length >= numberOfFriends) return;

        for (var i = 0; i<len; i++) arr.push(this.startingId+i);    // Fill up arr with profile IDs
        // Take out the source itself form the pool
        // Swap arr[source] and arr[maxIndex]
        temp = arr[source];
        arr[source] = arr[maxIndex];
        arr[maxIndex] = temp;
        maxIndex--;

        // Take out the profiles that are already the current profile's connections from the pool
        if (currentVAdjList.length > 0) {
            for (var i=0; i < currentVAdjList.length; i++) {
                if (arr.includes(currentVAdjList[i])) {
                    // console.log("arr " + sourceId + "has " + currentVAdjList[i]);
                    var index = arr.indexOf(currentVAdjList[i]);
                    temp = arr[index];
                    arr[index] = arr[maxIndex];
                    arr[maxIndex] = temp;
                    maxIndex--;
                }
            }
        }
        
        for (var i = currentVAdjList.length - 1; i < numberOfFriends; i++) {
            var randomIndex = this.getRandomNumInclusive(0, maxIndex);
            targetId = arr[randomIndex];

            temp = arr[randomIndex];
            arr[randomIndex] = arr[maxIndex];
            arr[maxIndex] = temp;
            maxIndex--;

            var weight = 5;
            this.connectionsList.push({
                source: source,
                target: targetId - this.startingId,
                weight: weight,
                sourceId: sourceId,
                targetId: targetId
            });
            this.graphInAdjList.addEdge(sourceId, targetId);
        }
    }

    // In d3 forceSimulation, source and target are the actual indices of the nodes instead of the ids
    generateConnections() {
        const min = 0, max = min - 1 + this.numberOfProfiles;
        const maxNumOfFriends = (max-1)/5;

        // During generating the random links between people, each profile's numberOfFriends is not the finalized number yet
        // as this is an undirected graph with adding edge data into both source's adjacency list and destination's adjacency list.
        // Therefore, each profile's number of friends will be finalized only at the end of the generation process.
        // In order to know that number, we can see this.graphInAdjList.get(vertex).length.
        var numberOfFriends = this.getRandomNumInclusive(min, maxNumOfFriends); // numberOfFriends must be 1 less than numberOfProfiles

        // Iterate for every profile in the network
        for (var i=0; i<this.numberOfProfiles; i++) {
            var source = i,
                sourceId = this.startingId + i;
            numberOfFriends = this.getRandomNumInclusive(min, maxNumOfFriends); // numberOfFriends must be 1 less than numberOfProfiles
            console.log(i + "-->" + numberOfFriends);

            this.getMFYShuffledRConnection(source, sourceId, numberOfFriends);

            //     // Need to add logic to eliminate the directed graph problems so that there is no extra relationships
            //     // especially, the problem is:
            //     //  even though person A does not know person B, somehow person B has connection to person A.
            //     //  This is because of the way, the random data is being generated.
        }
        console.log("------------Final Graph:------------- ");
        this.graphInAdjList.printGraph();

        console.log("-------------------------------------");
        console.log("This network has " + this.profilesList.length + "profiles.");
        console.log("This network has " + this.connectionsList.length + " connections.");
        console.log("-------------------------------------");
        this.graphInAdjList.getNumOfEdgesForEachV();
        console.log("-------------------------------------");

        console.log("---BFS from vertex 4 (105, numOfFriends= " + this.graphInAdjList.getCurrentVAdjList(105).length + ")---");
        this.graphInAdjList.bfs(105, this.startingId);
    }
    getNodesAndLinks() {
        this.generateRandomProfiles();
        this.generateConnections();
        var graphInAdjListObj = this.graphInAdjList.getGraphInAdjustListAsObj();
        const nodesAndLinks = {
            nodes: this.profilesList,
            links: this.connectionsList,
            graphInAdjList: graphInAdjListObj
        };

        var src = 101,
            dest = 150;
        this.graphInAdjList.printShortestDistance(src, dest, 101);
            
        return nodesAndLinks;
        // return JSON.stringify(nodesAndLinks);
    }
    reset() {
        this.graphInAdjList.clearGraph();
    }
    getValidDOB() {
        const minAgeForAProfile = 13;
        const longestLivingAge = 130;

        var today = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate());
        var latestValidDate = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate());
        var earliestValidDate = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate());
        const thisYear = today.getFullYear();

        var latestValidYear = thisYear - minAgeForAProfile;
        var earliestValidYear = thisYear - longestLivingAge;
        latestValidDate.setFullYear(latestValidYear);
        earliestValidDate.setFullYear(earliestValidYear);
        var dob = faker.date.between(earliestValidDate, latestValidDate);
        return dob.getDate() + "/" + dob.getMonth() + "/" + dob.getFullYear();
    }
}

module.exports = RandomProfilesGenerator;
