var countr = new Vue({
  el: "#countr",
  data: {
    accessToken:
      "EAACEdEose0cBAMZA98xyV3BcbmIE3ToIzCFHVKaCIzsqYV9Iq3y3t1ZA1eCGl2SGqrqLncJAg5s80QqwKmDjd8GCrAxqhrZAKZCF7Kcr025tv7HHpms3rsc8ZBARSU1QQ2RHSclyTZCZA0aX67hpVMNygMotwvJI4oUHNrFPqwbeviRbbdxZB4BeXQffLtCEes2zbZCa8dOwWiAZDZD",
    chart: null,
    comments: [],
    filters: "",
    pageId: "1614897458802033",
    postId: "1690591321232646"
  },
  created: function() {
    FB.init({
      appId: "1187659591254644",
      version: "v2.12"
    });
  },
  computed: {
    endpoint: function() {
      return "/" + this.pageId + "_" + this.postId + "/comments";
    },
    filterArray() {
      if (!this.filters || this.filters.length == 0) return [];

      return this.filters.split(/[,\s]+/gi);
    },
    hashTagArray: function() {
      return this.hashtags.split(/\s+/);
    }
  },
  methods: {
    buttonClick: function() {
      this.fetchComments();
    },
    countHashtags: function(hashtags) {
      return R.compose(R.toPairs, R.countBy(R.identity))(hashtags);
    },
    displayHashtags: function(hashtags) {
      var data = this.hashtagData(hashtags);
      var $chart = document.getElementById("chart");

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart($chart, {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: R.map(R.prop("percent"), data),
              backgroundColor: [
                "#5DA5DA",
                "#FAA43A",
                "#60BD68",
                "#F17CB0",
                "#B2912F",
                "#B276B2",
                "#DECF3F",
                "#F15854"
              ]
            }
          ],
          labels: R.map(R.prop("hashtag"), data)
        },
        options: {}
      });
    },
    fetchComments: function() {
      if (this.postId) {
        FB.api(this.endpoint, this.handleFbResponse, {
          access_token: this.accessToken
        });
      } else {
        this.$set(this, "comments", []);
      }
    },
    filterHashtag: function(hashtag) {
      if (this.filterArray.length == 0) return true;

      return R.contains(hashtag, this.filterArray);
    },
    filterHashtags: function(hashtags) {
      return R.filter(this.filterHashtag, hashtags);
    },
    handleFbResponse: function(response) {
      if (response && !response.error) {
        this.updateStats(response.data);
      } else {
        console.log("error", response.error);
      }
    },
    hashtagData: function(hashtags) {
      var total = this.sumHashtags(hashtags);

      return R.compose(
        R.map(function(kv) {
          var hashtag = kv[0];
          var count = kv[1];
          var percent = count / total;
          var displayPercent = percent.toLocaleString("en-US", {
            style: "percent"
          });

          return {
            count: count,
            displayPercent: displayPercent,
            hashtag: hashtag,
            percent: percent
          };
        }),
        R.sortBy(R.prop(0))
      )(hashtags);
    },
    parseHashtags(comments) {
      return R.compose(
        R.flatten,
        R.map(function(comment) {
          return comment.message.match(/#\w+/gi);
        })
      )(comments);
    },
    sumHashtags(hashtags) {
      return R.compose(
        R.sum,
        R.map(function(hashtag) {
          return hashtag[1];
        })
      )(hashtags);
    },
    updateStats(comments) {
      var hashtags = R.compose(
        this.countHashtags,
        this.filterHashtags,
        this.parseHashtags
      )(comments);

      this.$set(this, "comments", hashtags);
      this.displayHashtags(hashtags);
    }
  }
});
