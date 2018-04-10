var countr = new Vue({
  el: "#countr",
  data: {
    accessToken:
      "EAACEdEose0cBAKBtNxIMz8xbE37oRR9NInpkOlapO3hViyqFZAe41ecTljWqPGdEhrYsjdMtMEA4aR5tbUrQ2kR3Tsv2iTSK6pZBqHmSW4hy7LzzRZC236VR3yFT65RFYu1OYcZACwbVFUmZCBhnJ5om38GoRjrzRiKI6Bndc6uI6ZCizrB8xdvDS2wtfakm0ZD",
    comments: [],
    filters: "#sorrynotsorry, #tbt",
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
      var total = this.sumHashtags(hashtags);

      return R.compose(
        R.map(function(kv) {
          var hashtag = kv[0];
          var count = kv[1];
          var percent = count / total;
          var displayPercent = percent.toLocaleString("en-US", {
            style: "percent"
          });

          return hashtag + " => " + count + " (" + displayPercent + ")";
        }),
        R.sortBy(R.prop(0))
      )(hashtags);
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
        this.$set(this, "comments", ["error", response.error]);
      }
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
      this.$set(
        this,
        "comments",
        R.compose(
          this.displayHashtags,
          this.countHashtags,
          this.filterHashtags,
          this.parseHashtags
        )(comments)
      );
    }
  }
});
