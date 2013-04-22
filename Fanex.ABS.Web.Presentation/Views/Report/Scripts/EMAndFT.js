// Simple function to calculate time difference between 2 Javascript date objects
function get_time_difference(earlierDate, laterDate) {
    var nTotalDiff = laterDate.getTime() - earlierDate.getTime();
    var oDiff = new Object();

    oDiff.days = Math.floor(nTotalDiff / 1000 / 60 / 60 / 24);
    nTotalDiff -= oDiff.days * 1000 * 60 * 60 * 24;

    oDiff.hours = Math.floor(nTotalDiff / 1000 / 60 / 60);
    nTotalDiff -= oDiff.hours * 1000 * 60 * 60;

    oDiff.minutes = Math.floor(nTotalDiff / 1000 / 60);
    nTotalDiff -= oDiff.minutes * 1000 * 60;

    oDiff.seconds = Math.floor(nTotalDiff / 1000);

    return oDiff;
}
var EMAndFT = {
    curDate: null,
    initPage: function () {
        var mindate = -3;
        var maxdate = 6;
        var oDiff = get_time_difference(new Date(), new Date(toDate));
        mindate += oDiff.days + 1;
        maxdate += oDiff.days + 1;

        $("#txtdate").datepicker({
            minDate: mindate,
            maxDate: maxdate,
            dateFormat: "mm/dd/yy",
            today: new Date(toDate),
            onSelect: function (dateText, inst) {
                // TODO
                EMAndFT.getLeague(dateText);
            }
        });
        $("#txtdate").datepicker("setDate", new Date(toDate));

        // bind change
        $('#ddlLeague').change(function (e) {
            EMAndFT.getDetail();
        });

        // bind submit
        $('#btnSubmit').click(function (e) {
            EMAndFT.getDetail();
        });

        // init popup
        $('#popup-history').initPopup({
            title: "Goal History",
            width: 400,
            height: 250,
            onload: function () {
                // todo
            },
            onclose: function () {
                //$('#popup-history').empty();
            },
            multiple: false
        });

        // get all league
        var curDate = $("#txtdate").datepicker("getDate");
        EMAndFT.getLeague((1 + curDate.getMonth()) + '/' + curDate.getDate() + '/' + curDate.getFullYear());
        $('#btnToggle').click(function () {
            $("#filterSection").toggle("fast");
            if ($("#contentSection").css("padding-top") == "74px") {
                $("#contentSection").css("padding-top", "31px");
            } else {
                $("#contentSection").css("padding-top", "74px");
            }
        });
    },
    getLeague: function (txtDate) {
        if (txtDate) {
            this.curDate = txtDate;

            var ddLeague = $("#ddlLeague");
            var currVal = ddLeague.val();

            ddLeague.empty().append('<option sport="0" value="0" selected="selected">*..::¤ Show All Leagues  ¤::..*</option>');

            $.ajax({
                type: "POST",
                url: "SettleLeagueByDate",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: '{"textDate":"' + txtDate + '"}',
                beforeSend: function (xhr) {
                    loader.beforeSend();
                },
                success: function (resp) {
                    if (resp) {
                        resp = jlinq.from(resp).sort("LeagueName").select();
                        $(resp).each(function (i, elm) {
                            ddLeague.append('<option sport="' + elm.Sport + '" value="' + elm.League + '">' + elm.LeagueName + '</option>');
                        });
                        window.setTimeout(function () {
                            EMAndFT.getDetail();
                        }, 500);
                    }
                    loader.completeSend();
                }
            });
        }
    },
    getDetail: function () {
        var slLeague = $("#ddlLeague option:selected");
        if (slLeague) {
            var __allLeague = [], __lid = 0, __sport = 0, __isAll = false;

            __lid = parseInt(slLeague.val());
            __sport = parseInt(slLeague.attr('sport'));

            __lid > 0 ? __allLeague.push(__lid + '|' + __sport) : void (0);

            if (__lid == 0) {
                __isAll = true;
                __allLeague = [];

                $('#ddlLeague option').each(function (i, opt) {
                    __lid = parseInt($(opt).val());
                    __sport = parseInt($(opt).attr('sport'));

                    __lid > 0 ? __allLeague.push(__lid + '|' + __sport) : void (0);
                });
            }

            // unique data
            __allLeague = $.unique(__allLeague);

            var data = { textDate: this.curDate, leagues: __allLeague, isAll: __isAll };

            $.ajax({
                type: "POST",
                url: "SettleResult",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(data),
                beforeSend: function (xhr) {
                    loader.beforeSend();
                    $("input#btnSubmit").wait();
                },
                complete: function (jqXHR, textStatus) {
                    loader.completeSend();
                    $("input#btnSubmit").unwait();
                },
                success: function (resp) {
                    if (resp) {
                        $('#contentSection').empty();
                        var __refData = resp;
                        $(__refData).each(function (s, sport) {
                            var __tpl = EMAndFT.getTplSport(parseInt(sport.ID));
                            if (__tpl && $('#'.concat(__tpl)).length > 0) {
                                try {
                                    if (sport.ID == 1) { // only soccer
                                        $('#'.concat(__tpl)).tmpl(sport, {
                                            genLeague: function (__leagues) {
                                                var __tpl = '';
                                                $(__leagues).each(function (l, league) {
                                                    __tpl += $('<div />').append($('#tpl-soccer-league').tmpl(league)).html();
                                                });
                                                return __tpl;
                                            }
                                        }).appendTo('#contentSection');
                                        // fetch matches
                                        $(sport.Leagues).each(function (l, league) {
                                            var __divLeague = $('#tbl_league_'.concat(league.League).concat(' > tbody'));
                                            var __matches = league.Matches;
                                            if (__matches && __matches.length > 0) {
                                                $(__matches).each(function (m, match) {
                                                    $('#tpl-soccer-row').tmpl(match).appendTo(__divLeague);
                                                });
                                            }
                                        });
                                    } else {
                                        $('#'.concat(__tpl)).tmpl(sport).appendTo('#contentSection');
                                    }
                                }
                                catch (e) { /**alert('Error: ' + e);**/ }
                            }
                        });
                        window.setTimeout(function () {
                            $('div.collapse').click(function (e) {
                                EMAndFT.collapseSport(this);
                            });
                            $('div.leaguename').click(function () {
                                EMAndFT.collapseLeague(this);
                            });
                            $('a.goal-history').click(function (e) {
                                EMAndFT.goalHistory(this);
                            });

                            //try { if ($('body').height() > 600) { parent.pre_resize($('body').height()); } } catch (e) { }
                        }, 200);
                    }
                }
            });
        }
    },
    getTplSport: function (__sid) {
        var __tpl = '';
        if (__sid) {
            switch (__sid) {
                case 1: // soccer
                    __tpl = 'tpl-soccer';
                    break;
                case 2: // basketball
                case 3: // football
                case 26: // rugby
                case 32: // netball
                    __tpl = 'tpl-basketball';
                    break;
                case 4: //ice hockey
                case 28: // field hockey
                    __tpl = 'tpl-hockey';
                    break;
                case 5: // tennis
                    __tpl = 'tpl-tennis';
                    break;
                case 10: // golf
                case 11: // Motorsports
                case 7: // billiard
                case 29: //Winter Sports
                    __tpl = 'tpl-billiard';
                    break;
                case 8: // baseball
                    __tpl = 'tpl-baseball';
                    break;
                case 9: // badminton
                case 6: // volleyball
                case 30: //Squash
                    __tpl = 'tpl-badminton';
                    break;
                case 25:
                    __tpl = 'tpl-darts';
                case 201: //hide the FI result
                    break;
                case 151: //Horse horseracing
                    __tpl = 'tpl-horseracing';
                    break;
                case 161: //Horse numbergame
                    __tpl = 'tpl-numbergame';
                    break;
                default:
                    __tpl = 'tpl-common';
                    break;
            }
        }
        return __tpl;
    },
    collapseSport: function (elm) {
        if (elm) {
            var __sid = $(elm).attr('rel');
            if (!__sid) return;
            // toggle header
            $('tr.header_' + __sid).is(':hidden') ? $('tr.header_' + __sid).show() : $('tr.header_' + __sid).hide();
            // toggle sport
            $('#l_sport_' + __sid).is(':hidden') ? $('#l_sport_' + __sid).show() : $('#l_sport_' + __sid).hide();
            // change icon
            $(elm).parent().find('div').find('span').toggleClass('up');
            // parent border-bottom
            $(elm).parent().toggleClass('nb-bottom');
        }
    },
    collapseLeague: function (elm) {
        if (elm) {
            var __lid = $(elm).attr('rel');
            if (!__lid) return;
            // toggle match
            $('#m_league_' + __lid).slideToggle();
            // change icon
            $(elm).find('span').toggleClass('up');
        }
    },
    goalHistory: function (elm) {
        var __rel = $(elm).attr('rel').toString().split('|');
        var __his = $(elm).attr('his').toString();

        if (__rel.length > 0 && __his) {
            var __hisObj = { sport: $('sport_' + $('#league_'.concat(__rel[0])).attr('rel')).html(),
                league: $('#league_'.concat(__rel[0])).html(),
                home: $('#home_'.concat(__rel[1])).html(),
                away: $('#away_'.concat(__rel[1])).html(),
                records: []
            };
            var __hs = 0, __as = 0, __tn = '';

            for (var i = 0, len = __his.length; i < len; i++) {
                var __record = {}, __c = '' + __his.charAt(i);
                if (__c.toLowerCase() == 'h') {
                    __hs += 1;
                    __tn = 'Home';
                }
                else {
                    __as += 1;
                    __tn = 'Away';
                }
                __record.hs = __hs;
                __record.as = __as;
                __record.tn = __tn;
                __hisObj.records.push(__record);
            }

            $('#popup-history').empty().append($('#tpl-goal-history').tmpl(__hisObj));
            $('#popup-history').removeClass('hidden').showPopup();
        }
        return false;
    }
};
// util ajax loader
var loader = {
    beforeSend: function () {
        $("#btnSubmit").wait();
        try { parent.ABSBlockUI(); } catch (e) { }
    },
    completeSend: function () {
        $("#btnSubmit").unwait();
        try { parent.ABSUnBlockUI(); } catch (e) { }
    }
};