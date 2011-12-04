wikipedia = {}


wikipedia.searchTypes = {
      "artist": ["(artist)", "(band)", "(musician)"],
      "album": ["(album)"]
}



wikipedia.search = function(term, type, callback) {

      term = term.toLowerCase()
      type = type.toLowerCase()

      console.log("Searching Wikipedia for " + term + " of type " + type)
      $.getJSON("http://en.wikipedia.org/w/api.php?action=opensearch&format=json&limit=500&callback=?", {search:term}, function(data) {
        var results = data[1]
        var typeStrings = wikipedia.searchTypes[type]

        // try finding a match containing a type string
        for(i in results) {
          var result = results[i]
          for(j in typeStrings) {
            var typeString = typeStrings[j]
            if(result.toLowerCase().indexOf(typeString) > 0) {
              console.log("Found match containg search type " + result)
              callback(result)
              return
            }
          }
        }

        // didn't find anything with the search type, try finding an exact match
        for(i in results) {
          var result = results[i]
         if(result.toLowerCase() == term) {
            console.log("Found exact match " + result)
            callback(result)
            return
          }
        }

        // didn't find an exact match, just return the first match, if any
        if(results.length > 0) {
          console.log("Using first match " + results[0])
          callback(results[0])
          return
        } else {
          console.log("No match ")
          // nothing was found, give up
          callback(null)
        }
       })
}

wikipedia.html = function(page, callback) {
      $.getJSON("http://en.wikipedia.org/w/api.php?action=parse&format=json&callback=?&page=" + page, {prop:"text"}, function(data) {
        console.log("Page loaded " + page)
        var heading = decodeURIComponent(page.replace(/\_/g, " "))

        if(data.parse && data.parse.text) {
          var html = data.parse.text["*"]
          html = html.replace(/\/\//g, "http://")

          callback(heading, html)
        }
      })
}
