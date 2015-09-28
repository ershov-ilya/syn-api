/**
 * Created by PhpStorm.
 * Author:   ershov-ilya
 * GitHub:   https://github.com/ershov-ilya/
 * About me: http://about.me/ershov.ilya (EN)
 * Website:  http://ershov.pw/ (RU)
 * Date: 09.09.2015
 * Time: 13:28
 */

"use strict";

var FilteredList = React.createClass({
    displayName: "FilteredList",

    getInitialState: function getInitialState() {
        return {
            initialItems: ["Apples", "Broccoli", "Chicken", "Duck", "Eggs", "Fish", "Granola", "Hash Browns"],
            items: []
        };
    },

    componentWillMount: function componentWillMount() {
        this.setState({ items: this.state.initialItems });
    },

    componentDidMount: function componentDidMount() {
        $.get('http://synergy.ru/api/ajax/filter/get-sections/', (function (response) {
            console.log(response);

            /*
                if (this.isMounted()) {
                    this.setState({
                        items: response
                    });
                }
                */
        }).bind(this));
    },

    filterList: function filterList(event) {
        var updatedList = this.state.initialItems;
        updatedList = updatedList.filter(function (item) {
            return item.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
        });
        this.setState({ items: updatedList });
    },
    render: function render() {
        console.log('Render event');
        return React.createElement(
            "div",
            { className: "filter-list" },
            React.createElement("input", { type: "text", placeholder: "Search", onChange: this.filterList }),
            React.createElement(List, { items: this.state.items })
        );
    }
});

var List = React.createClass({
    displayName: "List",

    render: function render() {
        return React.createElement(
            "ul",
            null,
            this.props.items.map(function (item) {
                return React.createElement(
                    "li",
                    { key: item },
                    item
                );
            })
        );
    }
});

if (typeof FilteredList != 'undefined') {
    React.render(React.createElement(FilteredList, null), document.getElementById('FilteredListApp'));
}

/*
    <!-- Filter -->
    <section class="filter clearfix">
        <div class="filter-left">
            <div class="themes-title">Фильтры</div>
            <div class="drop-filter themes-filter">
                <a href="#" class="drop-link">Раздел</a>
                <ul>
                    <li><a href="" data-option="0">Раздел</a></li>
                </ul>
            </div>
        </div>
        <div class="filter-right">
            <span class="sorting-filter-title">сортировать</span>
            <ul class="sorting-filter">
                <li><a href="" data-option="publishedon">по дате</a></li>
                <li><a href="" data-option="speaker">по автору</a></li>

                <li><a href="" data-option="view_count">по популярности</a></li>
            </ul>
            <ul class="view-filter">
                <li><a href="" class="rows current"></a></li>
                <li><a href="" class="column"></a></li>
            </ul>
        </div>
    </section>
    <!-- /Filter -->

*/
