/** @odoo-module **/

import options from "web_editor.snippets.options";
import wUtils from "website.utils";
import core from "web.core";

const QWeb = core.qweb;

options.registry.DynamicSlidesOptions = options.Class.extend({
  start() {
    const slidesContainer = this.$target.find("#dynamic_slides_container");

    if (slidesContainer) {
      const websiteIdDomain = wUtils.websiteDomain(this);
      const domain = [...websiteIdDomain];

      this._rpc({
        route: "/e_commerce/get_slides",
        params: {
          domain,
        },
      }).then((data) => {
        slidesContainer.html(
          QWeb.render("website_slides_snippets.WebsiteSlides", { slides: data })
        );
      });
    }
  },
});

export default {
  DynamicSlidesOptions: options.registry.DynamicSlidesOptions,
};
