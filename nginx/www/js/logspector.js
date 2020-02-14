
var appLayout = (function() {
    return {
        init: function() {
            $('body').layout({
                resizable: false,
                closable: false,
                west: {
                    size: 300
                }
            });

            $("#accordion1").accordion({ heightStyle: "fill" });

            $.datepicker.setDefaults($.datepicker.regional['nl']); 
            $.datepicker.setDefaults({ dateFormat: 'yy-mm-dd' });
        }
    }
}());

var queryBuilderView = (function() {
    var dataSet = [
        [ "Organization", '<input type="text" id="queryOrganization" value="" style="width:100%">' ],
        [ "Application" , '<input type="text" id="queryApplication" value="" style="width:100%">' ],
        [ "Server"      , '<input type="text" id="queryServer" value="" style="width:100%">' ],
        [ "Group Name"  , '<input type="text" id="queryGroup" value="" style="width:100%">' ],
        [ "Status"      , '<input type="text" id="queryStatus" value="" style="width:100%">' ],
        [ "Date"        , '<input type="text" id="queryDate" value="2019-05-15" style="width:100%">' ],
        [ "Time"        , '<input type="text" id="queryTime" class="time"  style="width:100%">' ]
    ];

    return {
        init: function() {
            $('#queryTable').DataTable({
                data: dataSet,
                paging: false,
                searching: false,
                ordering: false,
                info: false,
                drawCallback: function() {
                    $("#queryTable thead").remove();
                    $("#queryTable tfoot").remove();
                    $("#queryTable_wrapper > div.fg-toolbar.ui-toolbar.ui-widget-header.ui-helper-clearfix.ui-corner-bl.ui-corner-br").hide();
                    
                    $('#queryDate').datepicker().datepicker("setDate", new Date());
                    $('#queryTime').timepicker({ 
                        'scrollDefault': 'now', 
                        'timeFormat': 'H:i:s'
                    });
                }
            });
        },

        getSearchQueryParams: function() {
            var queryParams = {
                organization: $('#queryOrganization')[0].value,
                application: $('#queryApplication')[0].value,
                server: $('#queryServer')[0].value,
                group: $('#queryGroup')[0].value,
                status: $('#queryStatus')[0].value,
                date: $('#queryDate')[0].value, 
                time: $('#queryTime')[0].value, 
            };
        
            if (queryParams.date !== "") {
                queryParams.date = new Date(queryParams.date).toISOString();
            }
        
            return queryParams;
        }
    }
}());

var logItemsView = (function() {
    var setupLogItemsTableChildRowHandler = function(dataTable) {
        // Track the ids of the details displayed rows
        var detailRows = [];
    
        $('#logItemsTable tbody').on( 'click', 'tr td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = dataTable.row( tr );
    
            var idx = $.inArray( tr.attr('id'), detailRows );
    
            if ( row.child.isShown() ) {
                tr.removeClass( 'details' );
                row.child.hide();
    
                // Remove from the 'open' array
                detailRows.splice( idx, 1 );
            }
            else {
                showLogDetails(row);
                tr.addClass( 'details' );

                // Add to the 'open' array
                if ( idx === -1 ) {
                    detailRows.push( tr.attr('id') );
                }
            }
        });
    
        // On each draw, loop over the `detailRows` array and show any child rows
        dataTable.on( 'draw', function () {
            $.each( detailRows, function ( i, id ) {
                $('#'+id+' td.details-control').trigger( 'click' );
            } );
        } );
    };

    var getAjaxDataQuery = function(data, queryParams) {
        var searchQuery = {
            "sort" : ["timestampOriginal"],
            "from": data.start,
            "size": data.length
        }
    
        var query = { bool: { must: [] }};
    
        if (queryParams.group !== "" || queryParams.server !== "" || queryParams.date !== "" || queryParams.status !== ""
                || queryParams.time !== "" || queryParams.application !== "" || queryParams.organization !== "") 
        {
            //groupname criteria
            if (queryParams.group !== "") {
                query.bool.must.push({ "match": { "processInfo.groupName" : queryParams.group }});
            }
    
            // server criteria
            if (queryParams.server !== "") {
                query.bool.must.push({ "match": { "processInfo.serviceName" : queryParams.server }});
            }
    
            // date-time criteria
            var inputDateTime = "";
            if (queryParams.date !== "") { inputDateTime = inputDateTime + queryParams.date; }
            if (queryParams.time !== "") { inputDateTime = inputDateTime.replace("00:00:00", queryParams.time); }
            if (inputDateTime !== "") {
                query.bool.must.push({ "range": { "timestampOriginal" : { "gt" : inputDateTime }}});
            }
    
            // organization criteria
            if (queryParams.organization !== "") {
                query.bool.must.push({ "match": { "transactionSummaryContext.org" : queryParams.organization }});
            }
    
            // application criteria
            if (queryParams.application !== "") {
                query.bool.must.push({ "match": { "transactionSummaryContext.app" : queryParams.application }});
            }

            // status criteria
            if (queryParams.status !== "") {
                query.bool.must.push({ "match": { "transactionElements.leg0.protocolInfo.http.status" : queryParams.status }});
            }

            searchQuery.query = query;
        }
    
        return JSON.stringify(searchQuery);
    };

    var processSearchResult = function(data) {
        data.recordsTotal = data.hits.total.value;
        data.recordsFiltered = data.hits.total.value;
    
        var result = $.map( data.hits.hits, function( hit ) {
            var source = hit._source;
            var processInfo  = source.processInfo;
            var transactionSummary = source.transactionSummary;
    
            var loggedTransaction = {
                //correlationId alone should be enough as an id, but if you ingest same data several times like I do, you end up with duplicate test data!
                id: "" + source.correlationId + "-"+ uniqueID(), 
                path: "",
                protocol: "",
                timestampOriginal: "",
                server: "",
                group: "",
                service: "",
                vhost: "",
                status: "",
                method: "",
                subject: "",
                duration: "",
                clientRequest: "",
                source: source
            };
    
            loggedTransaction.timestampOriginal = source.timestampOriginal || "";
            loggedTransaction.path      = (transactionSummary && transactionSummary.path) || "";
            loggedTransaction.protocol  = (transactionSummary && transactionSummary.protocol) || "";
            loggedTransaction.server    = (processInfo && processInfo.serviceName) || "";
            loggedTransaction.group     = (processInfo && processInfo.groupName) || "";
    
            var leg0 = source.transactionElements.leg0;
            if (leg0 != null) {
                loggedTransaction.service  = leg0.serviceName || "";
                loggedTransaction.duration = leg0.duration || "";
                loggedTransaction.clientRequest = (leg0.protocolInfo && leg0.protocolInfo.recvHeader) || "";

                if (leg0.protocolInfo && leg0.protocolInfo.http) {
                    loggedTransaction.status = (leg0.protocolInfo.http.status || "") + ' ' + (leg0.protocolInfo.http.statusText || "");
                    loggedTransaction.vhost    = leg0.protocolInfo.http.vhost || "";
                    loggedTransaction.method   = leg0.protocolInfo.http.method || "";
                }
            }
    
            loggedTransaction.details = '<button id="btnMore-' + loggedTransaction.id +'" class="classDetailsButton">Details</button>';
            return loggedTransaction;
        });
    
        return result;
    };

    var showLogDetails = function(row) {
        var childTableId = "child-" + row.data().id ;

        row.child(requestResponseDetailsTable.getTableOnChildRow(childTableId)).show();  
        requestResponseDetailsTable.updateTableOnChildRow(row.data(), childTableId);
    };

    var uniqueID = (function() {
        var id = 1;
        return function() { return id++; }
    })();

    var sleep = function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    return {
        update: function() {
            if ( $.fn.dataTable.isDataTable( '#logItemsTable' ) ) {
                var table = $('#logItemsTable').DataTable();
                table.ajax.reload();
            }
        },
    
        init: function(indexName) {
            var dataTable = $('#logItemsTable').DataTable({
                scrollCollapse: true,
                paging: true,
                pageLength: 10,
                pagingType: "simple_numbers",
                searching: false,
                ordering: false,
                processing: true,
                rowId      : "id",
                serverSide: true,
                stateSave : true,
                fixedColumns: true,
                columnDefs: [
                    { "width": "10px",  "targets": 0 },
                    { "width": "20px",  "targets": 1 },
                    { "width": "40px",  "targets": 2 },
                    { "width": "120px", "targets": 3 },
                    { "width": "70px",  "targets": 4 },
                    { "width": "50px",  "targets": 5 },
                    { "width": "40px",  "targets": 6 },
                    { "width": "20px",  "targets": 7 },
                    { "width": "25px",  "targets": 8 },
                    { "width": "90px",  "targets": 9 },
                    { "width": "40px",  "targets": 10 },
                    { "width": "40px",  "targets": 11 },
                    { "width": "20px",  "targets": 12 }
                ],
                ajax : {
                    type       : "POST",
                    contentType: 'application/json',
                    crossDomain: true,
                    url        : "http://localhost:9200/" + indexName + "/_search",
                    data       : function ( data ) {
                        var queryParams = queryBuilderView.getSearchQueryParams();
                        return getAjaxDataQuery(data, queryParams);
                    },
                    dataType: 'json',
                    dataSrc : function (data) {
                        return processSearchResult(data);
                    },
                    beforeSend: function () {
                        //$('#overlay').fadeIn();
                    },
                    complete: function () {
                        //sleep(100).then(() => $('#overlay').fadeOut());
                    }
                },
                columns: [
                    { "class": "details-control", "orderable": false, "data": null, "defaultContent": "" },
                    {'data': 'method'},
                    {'data': 'status'},
                    {'data': 'path'},
                    {'data': 'service'},
                    {'data': 'vhost'},
                    {'data': 'method'},
                    {'data': 'subject'},
                    {'data': 'duration'},
                    {'data': 'timestampOriginal'},
                    {'data': 'group'},
                    {'data': 'server'},
                    {'data': 'details'}
                ]
            });

            setupLogItemsTableChildRowHandler(dataTable);
            return dataTable;
        },

        getRowDataByDetailsButtonId: function(buttonId) {
            var rowId = '#' + buttonId.substr('btnMore-'.length);
            return $('#logItemsTable').DataTable().row(rowId).data();
        }
    }
}());

var eventHandlers = (function() {
    var logItemDetailsHandler = function() {
        $("#logItemsTable tbody").on('click', '.classDetailsButton', function() {
            var rowData = logItemsView.getRowDataByDetailsButtonId(this.id);
    
            circuitPathDetailsTable.update(rowData.source.circuitPath);
            requestResponseDetailsTable.updateTableOnDetailsView(rowData);
            traceDetailsTable.update(rowData.source.correlationId);

            showLogItemDetailsView();
        });
    };

    var showLogItemDetailsView = function() {
        $('#logItemsTable').parents('div.dataTables_wrapper').first().hide();
        $("#logItemDetailsOverlay").show();
    };
    
    var showLogItemsView = function() {
        $("#logItemDetailsOverlay").hide();
        $('#logItemsTable').parents('div.dataTables_wrapper').first().show();
        $('#logItemsTable').DataTable().columns.adjust().draw('page');
    };

    return {
        install: function() {
            logItemDetailsHandler();

            $("#executeQuery").click(function() {
                logItemsView.update();
            });
    
            $("#backBtn").click(function() {
                showLogItemsView();
            });
        }
    }
}());

var requestResponseDetailsTable = (function() {
    var getRequestResponseDataSet = function(rowData) {
        var leg0 = rowData.source.transactionElements.leg0;
        var httpClientRequest = (leg0 && leg0.protocolInfo
                                && leg0.protocolInfo.recvHeader
                                && leg0.protocolInfo.recvHeader.match(/[^\r\n]+/g)) || [];
    
        var leg1 = rowData.source.transactionElements.leg1;
        var httpGatewayResponse = (leg1 && leg1.protocolInfo
                                    && leg1.protocolInfo.recvHeader
                                    && leg1.protocolInfo.recvHeader.match(/[^\r\n]+/g)) || [];
    
        var i;
        if (httpGatewayResponse.length > httpClientRequest.length) {    
            for (i = httpClientRequest.length; i < httpGatewayResponse.length; i++) {
                httpClientRequest.push("");
            }
        } else {
            for (i = httpGatewayResponse.length; i < httpClientRequest.length; i++) {
                httpGatewayResponse.push("");
            }
        }
    
        var requestHeaders = httpClientRequest.splice(1);
        var responseHeaders = httpGatewayResponse.splice(1);
        var headers = [];
        
        for (i = 0; i < requestHeaders.length; i++) {
            headers.push( [ requestHeaders[i].trim(), responseHeaders[i].trim() ]);
        }
    
        return {
            request: httpClientRequest[0] || "",
            response: httpGatewayResponse[0] || "",
            headers: headers
        };
    };

    var updateTableContent = function(rowData, tableId) {
        var innerTbl = '#' + tableId;
        var innerToolbar = "#toolbar-" + tableId;
        var requestResponseData = getRequestResponseDataSet(rowData);
    
        if ( $.fn.dataTable.isDataTable(innerTbl) ) {
            $(innerTbl).DataTable().clear().destroy()
        }

        $(innerTbl).DataTable( {
            dom: '<"' + innerToolbar + '">frtip',
            data: requestResponseData.headers,
            searching: false,
            ordering: false,
            paging: false,
            info: false,
            columns: [
                { title: "Client Request", width: "50%"},
                { title: "Gateway Response" }
            ],
            drawCallback: function() {
                $(innerTbl + "_wrapper").addClass("requestResponseDetailsTableWrapper");
                $(innerTbl + " thead").hide();
                $(innerTbl).addClass("display compact requestResponseDetailsTable");
                $(innerToolbar).addClass("requestResponseDetailsToolbar");
                $(innerToolbar).html( requestResponseData.request + "<br>" + requestResponseData.response);

                if(tableId !== "requestResponseTable") {
                    $(innerToolbar).css({
                        "background-color":"#427d9f",
                        "color":"White"
                    });
                }
            }
        });
    };

    return {
        getTableOnChildRow: function(tableId) {
            return '<table id="' + tableId + '" class="cell-border" width="100%"></table>';
        },

        updateTableOnChildRow: function(rowData, tableId) {
            updateTableContent(rowData, tableId);
        },

        updateTableOnDetailsView: function(rowData) {
            updateTableContent(rowData, "requestResponseTable");
        }
    }
}());

var circuitPathDetailsTable = (function() {
    var circuitPathTableId = "#circuitPathTable";
    var treeTableRootId = 123;
    var defaultRevealLevelCount = 2;

    var parsePolicy = function(policy, context) {
        var childId = uniqueID();

        var policyRow  = buildPolicyRow(policy, context.parentId, childId);
        $(circuitPathTableId).treetable("loadBranch", context.parentNode, policyRow);
    
        if (context.level == defaultRevealLevelCount + 1) {
            context.nodeIDCollection.push(childId);
        } 

        if (policy.filters != null) {
            policy.filters.forEach(function(item, index, arr) {
                parseFilter(item, {
                    parentId: childId,
                    parentNode: $(circuitPathTableId).treetable("node", childId),
                    level: context.level + 1,
                    nodeIDCollection: context.nodeIDCollection
                });
            });
        }
    };

    var parseFilter = function(filter, context) {
        var childId = uniqueID();
    
        var filterRow = buildFilterRow(filter, context.parentId, childId);
        $(circuitPathTableId).treetable("loadBranch", context.parentNode, filterRow);
    
        if (context.level == defaultRevealLevelCount + 1) {
            context.nodeIDCollection.push(childId);
        } 

        if (filter.subPaths != null) {
            filter.subPaths.forEach(function(item, index, arr) {
                parsePolicy(item, {
                    parentId: childId,
                    parentNode: $(circuitPathTableId).treetable("node", childId),
                    level: context.level + 1,
                    nodeIDCollection: context.nodeIDCollection
                });
            });
        }
    };

    var buildPolicyRow = function(policy, parentId, childId) {
        var row   = '<tr id="' + childId + '" data-tt-id="' + childId + '" data-tt-parent-id="' + parentId + '">';
        row = row +    '<td>' + removeHtmlChars(policy.policy) + '</td>';
        row = row +    '<td></td>';
        row = row +    '<td>' + policy.execTime + '</td>';
        row = row +    '<td></td>';
        row = row + '</tr>';

        return row;
    };

    var buildFilterRow = function(filter, parentId, childId) {
        var row   = '<tr id="' + childId + '"data-tt-id="' + childId + '" data-tt-parent-id="' + parentId + '"  data-tt-branch="true">';
        row = row +    '<td>' + removeHtmlChars(filter.name) + '</td>';
        row = row +    '<td>' + filter.status + '</td>';
        row = row +    '<td>' + filter.execTime + '</td>';
        row = row +    '<td>' + new Date(filter.filterTime).toISOString(); + '</td>';
        row = row + '</tr>';

        return row;
    };

    var removeHtmlChars = function(str) {
        return str.replace("<", "").replace(">", "");
    };

    var uniqueID = (function() {
        var id = treeTableRootId+1;
        return function() { return id++; }
    })();

    return {
        init: function() {
            $(circuitPathTableId).treetable({ expandable: true });
        },

        update: function(circuitPath) {
            // destroy table
            $(circuitPathTableId).treetable('destroy');
            $(circuitPathTableId).find(".indenter").remove();

            // recreate table
            $(circuitPathTableId).treetable({ expandable: true });
            var rootNode = $(circuitPathTableId).treetable("node", treeTableRootId);

            if (circuitPath != null) {
                let nodeIDCollection = [];
                circuitPath.forEach(function(item, index, arr) {
                    parsePolicy(item, {
                        parentId: treeTableRootId, 
                        parentNode: rootNode, 
                        level: 1, 
                        nodeIDCollection: nodeIDCollection
                    });
                });

                nodeIDCollection.forEach(function(nodeId, index, arr) {
                    $(circuitPathTableId).treetable("collapseNode", nodeId);
                });
            }
        }
    }
}());

var traceDetailsTable = (function() {
    var traceIndexName;

    var processTraceResult = function(data) {
        data.recordsTotal = data.hits.total.value;
        data.recordsFiltered = data.hits.total.value;
    
        var result = $.map( data.hits.hits, function( hit ) {
            var source = hit._source;
            return {
                trace: source.message
            };
        });
    
        return result;
    };

    return {
        init: function(indexName) {
            traceIndexName = indexName;
        },

        update: function(correlationId) {
            var innerTbl = '#traceTable';

            if ( $.fn.dataTable.isDataTable(innerTbl)) {
                var table = $(innerTbl).DataTable();
                table.clear().destroy();
            }
        
            $(innerTbl).DataTable({
                dom: 'Brtp',
                paging: true,
                pageLength: 10,
                pagingType: "simple_numbers",
                searching: false,
                ordering: false,
                processing: true,
                serverSide: true,
                stateSave : true,
                fixedColumns: true,
                columnDefs: [
                    { "width": "100%",  "targets": 0 }
                ],
                ajax : {
                    type       : "POST",
                    contentType: 'application/json',
                    crossDomain: true,
                    url        : "http://localhost:9200/" + traceIndexName + "/_search",
                    data       : function ( data ) {
                        var searchQuery = {
                            "query" : {
                                "match": {
                                    "correlationId": correlationId
                                }
                            }
                        };
                        return JSON.stringify(searchQuery);
                    },
                    dataType: 'json',
                    dataSrc : function (data) {
                        return processTraceResult(data);
                    }
                },
                columns: [
                    {'data': 'trace'}
                ],
                drawCallback: function() {
                    $(innerTbl + "_wrapper").addClass("requestResponseDetailsTableWrapper");
                    $(innerTbl + " thead").hide();
                    $(innerTbl).addClass("display compact requestResponseDetailsTable");
                }
            });
        }
    }
}());

function onPageLoad(appContext) {
    appLayout.init();
    queryBuilderView.init();
    circuitPathDetailsTable.init();
    logItemsView.init(appContext.openlogIndexName);
    traceDetailsTable.init(appContext.traceIndexName);

    eventHandlers.install();
}