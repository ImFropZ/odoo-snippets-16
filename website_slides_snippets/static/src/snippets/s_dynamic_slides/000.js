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
  _setContainer: function () {
    this.containerEl = $(this.el).find(".dynamic_slides_container");
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
    if (this.data.length !== 0) {
      this.containerEl.html(
        QWeb.render("website_slides_snippets.WebsiteSlides", {
          slides: this.data,
        })
      );
    } else {
      this.containerEl.html(`<h1 style="margin:1rem auto;">No results found</h1>`);
    }
  },

  /**
   *
   * @private
   */
  _loading: function () {
    this.containerEl.html(`
    <div class="spinner-box">
      <div class="three-quarter-spinner"></div>
    </div>`);
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
    return this._super.apply(this, arguments).then(() => {
      this._setContainer();
      this._loading();
      return Promise.all([this._fetchData()]);
    });
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
