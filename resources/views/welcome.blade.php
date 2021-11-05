<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="icon" type="image/png" href="{{$app_logo ?? ''}}" />
</head>
<body>
    <div id="app">
        <index/>
    </div>
    <script src="{{ mix('js/app.js') }}"></script>
</body>
<script>window.Laravel = {csrfToken: '{{ csrf_token() }}'}</script>
</html>