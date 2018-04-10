var countr = new Vue({
  el: "#countr",
  data: {
    accessToken:
      "EAACEdEose0cBAKBtNxIMz8xbE37oRR9NInpkOlapO3hViyqFZAe41ecTljWqPGdEhrYsjdMtMEA4aR5tbUrQ2kR3Tsv2iTSK6pZBqHmSW4hy7LzzRZC236VR3yFT65RFYu1OYcZACwbVFUmZCBhnJ5om38GoRjrzRiKI6Bndc6uI6ZCizrB8xdvDS2wtfakm0ZD",
    comments: [],
    hashtags: "",
    pageId: "1614897458802033",
    postId: "1690591321232646"
  },
  created: function() {
    FB.init({
      appId: "1187659591254644",
      version: "v2.12"
    });

    this.fetchComments();
  },
  computed: {
    endpoint: function() {
      var result = "/" + this.pageId + "_" + this.postId + "/comments";

      console.log("endpoint", "result", result);

      return result;
    },
    hashTagArray: function() {
      return this.hashtags.split(/\s+/);
    }
  },
  methods: {
    countHashtags: function(hashtags) {
      return R.compose(R.toPairs, R.countBy(R.identity))(hashtags);
    },
    displayHashtags: function(hashtags) {
      return R.compose(
        R.map(function(kv) {
          return kv[0] + " => " + kv[1];
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
    filterHashtags: function(hashtags) {
      return hashtags;
    },
    handleFbResponse: function(response) {
      if (response && !response.error) {
        this.updateStats(response.data);
      } else {
        this.$set(this, "comments", ["error"]);
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
  },
  watch: {
    postId: function(newPostId) {
      this.fetchComments();
    }
  }
});
