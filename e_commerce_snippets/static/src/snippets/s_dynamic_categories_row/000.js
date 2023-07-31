odoo.define("website.dynamic_snippet_categories_row", function (require) {
  const publicWidget = require("web.public.widget");
  const wUtils = require("website.utils");
  const core = require("web.core");

  const QWeb = core.qweb;

  DynamicCategoriesRow = publicWidget.Widget.extend({
    selector: ".dynamic_snippet_categories_row",
    read_events: {
      "click [data-scroll-right]": "_onScrollRight",
      "click [data-scroll-left]": "_onScrollLeft",
    },
    /**
     *
     * @private
     */
    _getFilterDomain() {
      const filterDomain = [];

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
        route: "/e_commerce/get_product_categories_row",
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
      this.el.querySelector(".dynamic_cateogories_row_container").innerHTML =
        QWeb.render("e_commerce_snippets.CategoryRow", {
          categoryRows: this.data,
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
      console.log(this.data);
      return this._super.apply(this, arguments).then(() => {
        this._render();

        // const moveBackBtn = this.el.querySelector(
        //   ".dynamic-category-row-products__moveBack"
        // );
        // const moveFrontBtn = this.el.querySelector(
        //   ".dynamic-category-row-products__moveFront"
        // );

        // moveBackBtn.on("click", function () {

        // });

        // moveFrontBtn.on("click", function () {

        // });
      });
    },

    /**
     *
     * @private
     */
    _onScrollRight: function (e) {
      const container = $(e.currentTarget).siblings(
        ".dynamic-category-row-productsContainer"
      );

      const nextSectionOffset = container.scrollLeft() + container.width();
      container.animate({ scrollLeft: nextSectionOffset }, "slow");
    },

    /**
     *
     * @private
     */
    _onScrollLeft: function (e) {
      const container = $(e.currentTarget).siblings(
        ".dynamic-category-row-productsContainer"
      );
      const nextSectionOffset = container.scrollLeft() - container.width();
      container.animate({ scrollLeft: nextSectionOffset }, "slow");
    },

    /**
     *
     * @override
     */
    destroy: function () {},
  });

  publicWidget.registry.dynamic_categories_row_snippet = DynamicCategoriesRow;

  return DynamicCategoriesRow;
});
