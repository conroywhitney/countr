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
    fetchComments: function() {
      if (this.postId) {
        FB.api(this.endpoint, this.handleFbResponse, {
          access_token: this.accessToken
        });
      } else {
        this.$set(this, "comments", []);
      }
    },
    handleFbResponse: function(response) {
      if (response && !response.error) {
        this.parseHashtags(response.data);
      } else {
        this.$set(this, "comments", ["error"]);
      }
    },
    parseHashtags(comments) {
      var hashtags = comments.map(function(comment) {
        return comment.message.match(/#\w+/gi);
      });

      this.$set(this, "comments", R.flatten(hashtags));
    }
  },
  watch: {
    postId: function(newPostId) {
      this.fetchComments();
    }
  }
});
