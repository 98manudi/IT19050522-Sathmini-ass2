$(document).ready(function()
{
if ($("#alertSuccess").text().trim() == "")
{
$("#alertSuccess").hide();
}
$("#alertError").hide();
});

//SAVE ============================================



$(document).on("click", "#btnSave", function(event)
{
	// Clear alerts---------------------
	$("#alertSuccess").text("");
	$("#alertSuccess").hide();
	$("#alertError").text("");
	$("#alertError").hide();
	// Form validation-------------------
	var status = validateItemForm();
	if (status != true)
	{
	$("#alertError").text(status);
	$("#alertError").show();
	return;
}
	// If valid------------------------
	var type = ($("#hidItemIDSave").val() == "") ? "POST" : "PUT";
	$.ajax(
	{
	url : "PaymentAPI",
	type : type,
	data : $("#formItem").serialize(),
	dataType : "text",
	complete : function(response, status)
	{
	onItemSaveComplete(response.responseText, status);
	}
});
});

// UPDATE==========================================
	$(document).on("click", ".btnUpdate", function(event)
	{
	$("#hidItemIDSave").val($(this).closest("tr").find('#hidItemIDUpdate').val());
	$("#NIC").val($(this).closest("tr").find('td:eq(0)').text());
	$("#productID").val($(this).closest("tr").find('td:eq(1)').text());
	$("#creditNumber").val($(this).closest("tr").find('td:eq(2)').text());
	$("#cvv").val($(this).closest("tr").find('td:eq(3)').text());
	$("#expireDate").val($(this).closest("tr").find('td:eq(4)').text());
	$("#date").val($(this).closest("tr").find('td:eq(5)').text());
	$("#amount").val($(this).closest("tr").find('td:eq(6)').text());
	


});
	
function onItemSaveComplete(response, status)
	{
	if (status == "success")
		{
		var resultSet = JSON.parse(response);
		if (resultSet.status.trim() == "success")
		{
		$("#alertSuccess").text("Successfully saved.");
		$("#alertSuccess").show();
		$("#divItemsGrid").html(resultSet.data);
		} else if (resultSet.status.trim() == "error")
		{
		$("#alertError").text(resultSet.data);
		$("#alertError").show();
		}
		} else if (status == "error")
		{
		$("#alertError").text("Error while saving.");
		$("#alertError").show();
		} else
		{
		$("#alertError").text("Unknown error while saving..");
		$("#alertError").show();
		}
		$("#hidItemIDSave").val("");
		$("#formItem")[0].reset();
	}

	$(document).on("click", ".btnRemove", function(event)
	{
	$.ajax(
	{
	url : "PaymentAPI",
	type : "DELETE",
	data : "paymentID=" + $(this).data("itemid"),
	dataType : "text",
	complete : function(response, status)
	{
	onItemDeleteComplete(response.responseText, status);
	}
	});
	});

function onItemDeleteComplete(response, status)
	{
	if (status == "success")
	{
		
	if (resultSet.status.trim() == "success")
	{
		$("#alertSuccess").text("Successfully deleted.");
		$("#alertSuccess").show();
		$("#divItemsGrid").html(resultSet.data);
	} else if (resultSet.status.trim() == "error")
	{
		$("#alertError").text(resultSet.data);
		$("#alertError").show();
	}
	} else if (status == "error")
	{
		$("#alertError").text("Error while deleting.");
		$("#alertError").show();
	} else
	{
		$("#alertError").text("Unknown error while deleting..");
		$("#alertError").show();
	}
	}

//CLIENT-MODEL================================================================
function validateItemForm()
{
	// name
	if ($("#NIC").val().trim() == "")
	{
			return "Insert NIC.";
	}
	// type
	if ($("#productID").val().trim() == "")
	{
			return "Insert Product ID.";
	}
	// userid -------------------------------
	if ($("#creditNumber").val().trim() == "")
	{
			return "Insert credit number.";
	}
	// is numerical value
	var creditNumber = $("#creditNumber").val().trim();
	if (!$.isNumeric(creditNumber))
	{
	return "Insert a numerical value for creditNumber.";
	}
	// sdate
	if ($("#expireDate").val().trim() == "")
	{
			return "Insert expireDate.";
	}
	// edate
	if ($("#date").val().trim() == "")
	{
			return "Insert date.";
	}
	
	//validate date
	var sdate=$("#date").val();
	sdate=new Date(sdate).getTime();
	
	var edate=$("#expireDate").val();
	edate=new Date(edate).getTime();
	
	if(edate<sdate)
	{
		return "Invalid dates..end date should be greater than start date";
	}
	
	
	// investment amount
	if ($("#amount").val().trim() == "")
	{
			return "Insert  amount.";
	}
	
	// is numerical value
	var amount = $("#amount").val().trim();
	if (!$.isNumeric(amount))
	{
	return "Insert a numerical value for amount.";
	}
	// convert to decimal price
	$("#amount").val(parseFloat(amount).toFixed(2));
	
	
	
			return true;
}