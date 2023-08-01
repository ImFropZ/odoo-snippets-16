/** @odoo-module **/

import PublicWidget from "web.public.widget";
import core from "web.core";
import wUtils from "website.utils";

const QWeb = core.qweb;

PublicWidget.registry.DynamicSlides = PublicWidget.Widget.extend({
  selector: ".dynamic_snippet_slides",

  /**
   *
   * @private
   */
  _getFilterDomain: function () {
    return [];
  },

  /**
   *
   * @private
   */
  _getDomain: function () {
    const domain = wUtils.websiteDomain(this);

    return domain;
  },

  /**
   *
   * @private
   */
  _render: async function () {
    this.el.querySelector("#dynamic_slides_container").innerHTML = QWeb.render(
      "website_slides_snippets.WebsiteSlides",
      { slides: this.data }
    );
  },

  /**
   *
   * @private
   */
  _fetchData: async function () {
    const data = await this._rpc({
      route: "/website_slides/get_slides",
      params: {
        domain: [...this._getDomain(), ...this._getFilterDomain()],
      },
    });
    this.data = data;
  },

  /**
   *
   * @overwrite
   */
  willStart: function () {
    return this._super
      .apply(this, arguments)
      .then(() => Promise.all([this._fetchData()]));
  },

  /**
   *
   * @overwrite
   */
  start: function () {
    return this._super.apply(this, arguments).then(() => {
      this._render();
    });
  },
});

export default PublicWidget.registry.DynamicSlides;
