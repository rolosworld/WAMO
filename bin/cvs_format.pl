#!/usr/bin/env perl

use Text::CSV;

my @files = @ARGV;
    
my $csv = Text::CSV->new({ binary => 1, auto_diag => 1, eol => "\n" })  # should set binary attribute.
    or die "Cannot use CSV: " . Text::CSV->error_diag ();

for my $file (@files) {
    print `dos2unix $file`;
    
    open my $fh_in, "<:encoding(utf8)", $file or die "$file: $!";
    open my $fh_out, ">:encoding(utf8)", "$file.fixed" or die "$file.fixed: $!";

    while ( my $row = $csv->getline( $fh_in ) ) {
        $csv->print ($fh_out, $row) or $csv->error_diag;
    }

    close $fh_out or die "$file.fixed: $!";
    close $fh_in or die "$file: $!";

    print `mv "$file.fixed" $file`;
}

$csv->eol ("\n");

