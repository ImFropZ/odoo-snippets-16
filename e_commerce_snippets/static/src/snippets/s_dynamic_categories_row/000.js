odoo.define("website.dynamic_snippet_categories_row", function (require) {
  const publicWidget = require("web.public.widget");
  const wUtils = require("website.utils");
  const core = require("web.core");
  const wSaleUtils = require("website_sale.utils");

  const QWeb = core.qweb;

  const DynamicCategoriesRow = publicWidget.Widget.extend({
    selector: ".dynamic_snippet_categories_row",
    read_events: {
      "click [data-scroll-right]": "_onScrollRight",
      "click [data-scroll-left]": "_onScrollLeft",
      "click .add-cart": "_onAddToCart",
    },

    start() {
      this.add2cartRerender = this.el.dataset.add2cartRerender === "True";
    },

    /**
     *
     * @private
     */
    _getFilterDomain: function () {
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
     * @private
     */
    _onAddToCart: async function (e) {
      const card = $(e.currentTarget).closest(
        ".dynamic-category-row-productCard"
      );

      const productId = card.data("product-id");

      const data = await this._rpc({
        route: "/shop/cart/update_json",
        params: {
          product_id: productId,
          add_qty: 1,
        },
      });

      const $navButton = $("header .o_wsale_my_cart").first();
      await wSaleUtils.animateClone($navButton, card, 25, 40);
      wSaleUtils.updateCartNavBar(data);
      if (this.add2cartRerender) {
        this.trigger_up("widgets_start_request", {
          $target: this.$el.closest(".dynamic_snippet_categories_row"),
        });
      }
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
