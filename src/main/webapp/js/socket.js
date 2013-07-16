(function() {
    var mailEndpoint, mailRequest, fooEndpoint, fooRequest, broadcastRequest, broadcastEndpoint, testFrame,
        // Obviously this isn't secure but what we have for now
        UPClient = AeroGear.UnifiedPushClient( AeroGear.SimplePush.variantID, "baec0293-a04e-4e49-82ef-b60ccbfba2fd", "http://localhost:8080/ag-push/rest/registry/device" );

    getTextAreaElement().value = "Web Socket opened!";

    broadcastRequest = navigator.push.register();
    broadcastRequest.onsuccess = function( event ) {
        broadcastEndpoint = event.target.result;
        UPClient.registerWithPushServer( "broadcast", broadcastEndpoint );
        appendTextArea("Subscribed to Broadcast messages on " + broadcastEndpoint.channelID);
        $("#broadcastVersion").val( localStorage.getItem( broadcastEndpoint.channelID ) || 1 );
        $("#broadcast").prop("disabled", false);
    };

    mailRequest = navigator.push.register();
    mailRequest.onsuccess = function( event ) {
        mailEndpoint = event.target.result;
        UPClient.registerWithPushServer( "mail", mailEndpoint, "test@test.com" );
        $("#mailVersion").attr("name", mailEndpoint.channelID);
        appendTextArea("Subscribed to Mail messages on " + mailEndpoint.channelID);
        $("#mailVersion").val( localStorage.getItem( mailEndpoint.channelID ) || 1 );
        $("#mail").prop("disabled", false);
    };

    fooRequest = navigator.push.register();
    fooRequest.onsuccess = function( event ) {
        fooEndpoint = event.target.result;
        UPClient.registerWithPushServer( "foo", fooEndpoint, "test@test.com" );
        $("#fooVersion").attr("name", fooEndpoint.channelID);
        appendTextArea("Subscribed to Foo messages on " + fooEndpoint.channelID);
        $("#fooVersion").val( localStorage.getItem( fooEndpoint.channelID ) || 1 );
        $("#foo").prop("disabled", false);
    };

    navigator.setMessageHandler( "push", function( message ) {
        if ( message.channelID === mailEndpoint.channelID ) {
            appendTextArea("Mail Notification - " + message.version);
            $("#mailVersion").val( +message.version + 1 );
            localStorage.setItem( message.channelID, +message.version + 1 );
        } else if ( message.channelID === fooEndpoint.channelID ) {
            appendTextArea("Foo Notification - " + message.version);
            $("#fooVersion").val( +message.version  + 1);
            localStorage.setItem( message.channelID, +message.version + 1 );
        } else if ( message.channelID === broadcastEndpoint.channelID ) {
            // Broadcast messages are subscribed by default and can be acted on as well
            appendTextArea("Broadcast Notification - " + message.version);
            $("#broadcastVersion").val( +message.version + 1 );
            localStorage.setItem( message.channelID, +message.version + 1 );
        }
    });

    function appendTextArea(newData) {
        var el = getTextAreaElement();
        el.value = el.value + '\n' + newData;
    }

    function getTextAreaElement() {
        return document.getElementById('responseText');
    }

    $("button").on("click", function( event ) {
        var urlSwitch, data,
            $this = $(this),
            type = this.id,
            input = $("#" + type + "Version"),
            idArray = [ input.attr("name") ],
            val = input.val();

        $this.prop("disabled", true);

        if ( type === "broadcast" ) {
            urlSwitch = "broadcast";
            data = {
                "simple-push": "version=" + val
            };
        } else {
            // UGLY HACK
            simplePushVal = {};
            simplePushVal[type] = "version=" + val;

            urlSwitch = "selected",
            data = {
                alias: ["test@test.com"],
                message: {
                    "simple-push": simplePushVal
                }
            };
        }

        $.ajax({
            url: "http://" + window.location.hostname + ":8080/ag-push/rest/sender/" + urlSwitch,
            contentType: "application/json",
            dataType: "json",
            type: "POST",
            headers: {
                "Authorization": "Basic " + window.btoa("f9e1a55e-4717-4652-a26d-39cc873d0964:517a2ae0-758f-4baa-9357-fd71488fef1b")
            },
            data: JSON.stringify( data ),
            complete: function() {
                $this.prop("disabled", false);
            }
        });
    });
})();
