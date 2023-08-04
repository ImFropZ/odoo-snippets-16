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
    _getFilterDomain: function () {
      const filterDomain = [];

      return filterDomain;
    },

    /**
     *
     * @private
     */
    _getDomain: function () {
      const domain = wUtils.websiteDomain(this);

      return domain;
    },

    _setContainer: function () {
      this.containerEl = $(this.el).find(".dynamic_cateogories_row_container");
    },

    /**
     *
     * @private
     */
    _fetchData: async function () {
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
      if (this.data.length !== 0) {
        this.containerEl.html(
          QWeb.render("e_commerce_snippets.CategoryRow", {
            categoryRows: this.data,
          })
        );
      } else {
        this.containerEl.html(
          `<h1 style="margin:1rem auto;">No results found</h1>`
        );
      }
    },

    /**
     *
     * @private
     */
    _loading: function () {
      this.el.querySelector(".dynamic_cateogories_row_container").innerHTML = `
      <div class="spinner-box">
        <div class="three-quarter-spinner"></div>
      </div>
      `;
    },

    /**
     *
     * @override
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
     * @override
     */
    start: function () {
      return this._super.apply(this, arguments).then(() => {
        this._render();
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
