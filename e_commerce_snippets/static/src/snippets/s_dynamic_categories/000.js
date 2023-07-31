odoo.define("website.dynamic_snippet_categories", function (require) {
  const publicWidget = require("web.public.widget");
  const wUtils = require("website.utils");
  const core = require("web.core");

  const QWeb = core.qweb;

  DynamicCategories = publicWidget.Widget.extend({
    selector: ".dynamic_snippet_categories",
    /**
     *
     * @private
     */
    _getFilterDomain() {
      const filterDomain = [];

      this.el.dataset.categoryNames
        .split(",")
        .filter((val) => val !== "")
        .forEach((val) => {
          val = val.trim();
          filterDomain.push(["name", "not ilike", val]);
        });

      return filterDomain;
    },

    /**
     *
     * @private
     */
    _getDomain() {
      const domain = wUtils.websiteDomain(this);

      return domain;
    },

    /**
     *
     * @private
     */
    async _fetchData() {
      data = await this._rpc({
        route: "/e_commerce/get_product_categories",
        params: {
          domain: [...this._getDomain(), ...this._getFilterDomain()],
        },
      });
      this.data = data;
    },

    /**
     *
     * @private
     */
    _render: function () {
      console.log(this.data);

      this.el.querySelector(".dynamic_cateogories_container").innerHTML =
        QWeb.render("e_commerce_snippets.CatagoryContainer", {
          categories: this.data,
        });
    },

    /**
     *
     * @override
     */
    willStart: function () {
      return this._super
        .apply(this, arguments)
        .then(() => Promise.all([this._fetchData()]));
    },

    /**
     *
     * @override
     */
    start: function () {
      return this._super.apply(this, arguments).then(() => {
        this._render();
      });
    },
  });

  publicWidget.registry.dynamic_categories_snippet = DynamicCategories;

  return DynamicCategories;
});
