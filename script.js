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
      var vue = this;

      if (this.postId) {
        FB.api(
          this.endpoint,
          function(response) {
            console.log("fetchComments", "response", response);

            if (response && !response.error) {
              console.log("fetchComments", "success");

              vue.$set(
                vue,
                "comments",
                response.data.map(function(d) {
                  return d.message;
                })
              );
            } else {
              console.log("fetchComments", "error");

              vue.$set(vue, "comments", ["error"]);
            }
          },
          { access_token: this.accessToken }
        );
      } else {
        console.log("fetchComments", "no postId");
        vue.$set(vue, "comments", []);
      }
    }
  },
  watch: {
    postId: function(newPostId) {
      this.fetchComments();
    }
  }
});
