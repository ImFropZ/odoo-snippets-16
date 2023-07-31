/** @odoo-module **/

import options from "web_editor.snippets.options";
import wUtils from "website.utils";

options.registry.DynamicCategoriesOptions = options.Class.extend({
  start() {
    const categoriesContainer = this.$target.find(
      "#dynamic_cateogories_container"
    );

    if (categoriesContainer) {
      // Search domain setup
      var websiteIdDomain = wUtils.websiteDomain(this);
      var domain = [...websiteIdDomain];

      this.$el
        .attr("data-category-names")
        .split(",")
        .filter((val) => val !== "")
        .forEach((val) => {
          val = val.trim();
          domain.push(["name", "not ilike", val]);
        });

      this._rpc({
        route: "/e_commerce/get_product_categories",
        params: {
          domain,
        },
      }).then((data) => {
        let html = ``;
        data.forEach((category) => {
          html += `<a href="${category.website_url}">
                    <div class="item">
                      <div class="border">
                        <img src="data:image/jpeg;base64,${category.image}" alt="${category.name}"/>
                      </div>
                      <div class="text">${category.name}</div>
                    </div>
                  </a>`;
        });
        categoriesContainer.html(html);
      });
    }
  },
});

export default {
  DynamicCategoriesOptions: options.registry.DynamicCategoriesOptions,
};
