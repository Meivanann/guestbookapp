# Generated by Django 3.2.4 on 2021-07-28 14:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('online_grocery_app', '0010_rename_user_id_billing_detail_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='billing_detail',
            name='order',
            field=models.CharField(default=0, max_length=100),
            preserve_default=False,
        ),
    ]
