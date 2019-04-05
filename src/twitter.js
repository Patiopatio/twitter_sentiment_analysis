let myPieChart
initializeChart()
searchQuery()

function searchQuery() {
  let tweetValue = document.getElementById("search-input").value
  getTweets(tweetValue)
}

function getTweets(tweetValue) {
  url = 'https://tsaa.herokuapp.com/tweets?query='+tweetValue
  $.ajax({
    url:url,
    dataType:'json',
    type:'GET',

    success: function(response){
      redrawChart(response.data)
      displayTweets(response.data)
    }
  })
}

// get sum in this order as array 'Neutral', 'Positive', 'Negative'
// 2 function sumOfTweetPolarities(tweets) --> returns [12,50,38]
function sumOfTweetPolarities(tweets){
  let neutral = 0
  let positive = 0
  let negative = 0
  for (idx in tweets){
    let tweet = tweets[idx]
    if (tweet["sentiment_status"] === "neutral"){
      neutral += 1
    }
    else if (tweet["sentiment_status"] === "positive") {
      positive += 1
    }
    else {
      negative += 1
    }
  }
  return [neutral, positive, negative]

}

function initializeChart(){
  let option = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {

          let datasets = ctx.chart.data.datasets;

          if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
            let sum = datasets[0].data.reduce((a, b) => a + b, 0);
            let percentage = Math.round((value / sum) * 100) + '%';
            return percentage;
          } else {
            return percentage;
          }
        },
        color: 'black',
      }
    }
  };

  // 2 call function Get sum of tweets
  let data = {
    labels: ['Neutral', 'Positive', 'Negative'],
    tooltips: {
      enabled: false
    },
    datasets: [{
      label: '# of Sentiments',
      data: [],
      backgroundColor: [
        'rgba(0, 0, 255, 0.2)',
        'rgba(0, 128, 0, 0.2)',
        'rgba(255, 0, 0, 0.2)',
      ],
      borderColor: [
        'rgba(0, 0, 255, 1)',
        'rgba(0, 128, 0, 1)',
        'rgba(255, 0, 0, 1)',
      ],
      borderWidth: 1
    }]
  };

  let ctx = document.getElementById('myChart').getContext('2d');
  myPieChart = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: option
  });

}
function displayTweets(tweets) {
  // clear previous tweets
  document.getElementById("search-results").innerHTML = '';

  for (idx in tweets) {
    const tweet = tweets[idx]
    let tweetResults = document.getElementById("search-results")
    tweetElement = document.createElement("div")
    let tweetCard = document.createElement("div")

    if(tweet["sentiment_status"] === "positive") {
      tweetCard.className = "card bg-success"
    }
    else if (tweet["sentiment_status"] === "negative") {
      tweetCard.className = "card bg-danger "
    }
    else {
      tweetCard.className = "card bg-light "
    }

    let cardHeader = document.createElement("div")
    cardHeader.className = "card-header"
    cardHeader.innerHTML = tweet["sentiment_status"]
    let cardBody = document.createElement("div")
    cardBody.className = "card-body"
    let cardTitle = document.createElement("div")
    cardTitle.className = "card-title"
    cardTitle.innerHTML = tweet["user"]
    let cardText = document.createElement("div")
    cardText.className = "card-text"
    cardText.innerHTML = tweet["text"]

    cardBody.appendChild(cardTitle)
    tweetCard.appendChild(cardHeader)
    tweetCard.appendChild(cardBody)
    cardBody.appendChild(cardText)
    tweetElement.appendChild(tweetCard)
    tweetResults.appendChild(tweetElement)
  }

  //  neutral = light, negative = danger, positive = success

}

function redrawChart(tweets) {
  myPieChart.data.datasets[0].data = []

  let sentimentSums = sumOfTweetPolarities(tweets)
  myPieChart.data.datasets[0].data = sentimentSums
  myPieChart.update()
}
