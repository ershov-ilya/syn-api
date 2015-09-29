/**
 * Created by PhpStorm.
 * Author:   ershov-ilya
 * GitHub:   https://github.com/ershov-ilya/
 * About me: http://about.me/ershov.ilya (EN)
 * Website:  http://ershov.pw/ (RU)
 * Date: 09.09.2015
 * Time: 13:28
 */
function closeFilters(){
    $(".drop-filter ul").fadeOut('fast').data('open-state',0);
}

var FilteredList = React.createClass({
    DEBUG: false,

    handleFilterOpenClose: function(e){
     	    var $this=$(e.target);
     	    var state=$this.data('open-state');
     		if(!state){
     		   $this.parents(".drop-filter").find("UL").fadeIn('fast').data('open-state',1);
     		}
     		else{
     		   $this.parents(".drop-filter").find("UL").fadeOut('fast').data('open-state',0);
     		}
     		state = !state;
     	   return false;
    },

     handleSectionClick: function(e) {
        e.preventDefault();
        var $target=$(e.target),
        section;

        if(this.DEBUG) console.log($target.get(0));
        section={
            id: $target.data('option'),
            name: $target.text()
        };

        if(this.DEBUG) console.log('section');
        if(this.DEBUG) console.log(section);

        this.state.query.section=section;
        if(this.state.query.section.id==0) {
            this.state.filters.course=[];
            this.state.query.course={id:0, name:'Курс'};
        }
        this.setState(this.state);

         $.get('http://synergy.ru/api/ajax/filter/get-sections/?course='+section.id, function(response) {
            response=JSON.parse(response);
             if (this.isMounted()) {
                if(typeof response.sections != 'undefined') this.state.filters.sections=response.sections;
                if(typeof response.course != 'undefined') this.state.filters.course=response.course;
                 this.setState({
                    filters: this.state.filters
                 });
             }
         }.bind(this));

        closeFilters();
      },

    handleCourseClick: function(e) {
        e.preventDefault();
        var $target=$(e.target);
        var courseId=$target.data('course-id');

        if(this.DEBUG) console.log($target.get(0));
        course={
            id: $target.data('option'),
            name: $target.text()
        };

        if(this.DEBUG) console.log('course');
        if(this.DEBUG) console.log(course);

        this.state.query.course=course;
        this.setState(this.state);
        closeFilters();
    },

    getInitialState: function(){
        return {
            filters:{
                sections:[],
                course:[]
            },
            query:{
                section:{
                    id:0,
                    name:'Раздел'
                },
                course:{
                    id:0,
                    name:'Курс'
                }
            }
        }
    },

    componentWillMount: function(){ // Функция инциализации
        //this.setState({items: this.state.initialItems})
    },

    componentDidMount: function() {
         $.get('http://synergy.ru/api/ajax/filter/get-sections/', function(response) { //?course=9574
            response=JSON.parse(response);
            if(typeof response.sections == 'undefined') response.sections = [];
            if(typeof response.course == 'undefined') response.course = [];

             if (this.isMounted()) {
                 this.setState({
                     filters: response
                 });
             }
         }.bind(this));

        // Обработка событий
        $('#FilteredListApp').on('click', '.drop-link', this.handleFilterOpenClose);
        $('#FilteredListApp').on('click', '.section-filter ul a', this.handleSectionClick.bind(this));
        $('#FilteredListApp').on('click', '.course-filter ul a', this.handleCourseClick.bind(this));
    },


    render: function(){
        if(this.DEBUG) {
            console.log('Render event');
            console.log('Current filters:');
            console.log(this.state.filters);
        }

        var showSub=(this.state.filters.course.length)?true:false;
        var subFilterStyle={
            display:(showSub)?'block':'none'
        };

        return (
            <div>
                <section className="filter clearfix">
                    <div className="filter-left">
                        <div className="themes-title">Фильтры</div>
                        <div className="drop-filter themes-filter section-filter">
                            <a href="#" className="drop-link">{this.state.query.section.name}</a>
                            <ul className="drop-list">
                                <li><a href="" data-option="0">Раздел</a></li>
                                {
                                    this.state.filters.sections.map(function(item) {
                                        return (
                                            <li><a href="" data-option={item.id}>{item.pagetitle}</a></li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                        <div className="drop-filter themes-filter course-filter" style={subFilterStyle}>
                            <a href="#" className="drop-link">{this.state.query.course.name}</a>
                            <ul className="drop-list">
                                <li><a href="" data-option="0">Курс</a></li>
                                {
                                    this.state.filters.course.map(function(item) {
                                        return (
                                            <li><a href="" data-option={item.id}>{item.pagetitle}</a></li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </section>
                <p>Запрос: {JSON.stringify(this.state.query)}</p>
                <section className="filter-content">
                    <List course={this.state.query.course.id || 0} name={this.state.query.course.name || ''} />
                </section>
            </div>
        );
    }
});



var List = React.createClass({
    DEBUG: true,

    getInitialState: function(){
        return {
            content:'',
            url:'http://synergy.ru/api/ajax/filter/get-course-html/',
            course:0
        }
    },

    componentWillMount: function(){ // Функция инциализации
        //this.setState({items: this.state.initialItems})
    },

    componentDidMount: function() {
         $('#FilteredContent').hide();
   },

    componentDidUpdate: function(){
        if(this.DEBUG) console.log('componentDidUpdate event');
        if(this.DEBUG) {
            console.log('>>> props:');
            console.log(this.props);
        }
        if(typeof this.props.course != 'undefined' && this.props.course>0 && this.props.course!=this.state.course){
            this.setState({course: this.props.course});
            console.log('Ajax request for content');
            $.get(this.state.url+'?course='+this.props.course, function(response) { //?course=9574
//                console.log(response);
                $('#FilteredContent').fadeOut(300).html(response).fadeIn(300);
            }.bind(this));
        }
    },

    componentWillReceiveProps: function(){
        if(this.DEBUG) console.log('componentWillReceiveProps event');
    },


    render: function(){
        if(this.DEBUG) {
            console.log('Render event');
//            console.log('props:');
//            console.log(this.props);

//            console.log('state:');
//            console.log(this.state);
        }
        return <p>&nbsp;</p>;
    }
});

if(typeof FilteredList != 'undefined') {
    React.render(<FilteredList/>, document.getElementById('FilteredListApp'));
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

